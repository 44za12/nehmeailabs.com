import os
import json
import time
import itertools
from typing import Any, Dict, List, Literal, Optional, Tuple

import pandas as pd
from datasets import load_dataset
from tqdm import tqdm

# Uses the Ollama Python SDK. Install with:
#   uv pip install ollama datasets pandas tqdm
import ollama

# --- Configuration ---
OLLAMA_MODEL = "hf.co/nehmeailabs-org/nehme-flashcheck-270m:Q8_0"
SAMPLE_SIZE = 200
SHUFFLE_SEED = 42
MAX_NEW_TOKENS = 8
TEMPERATURE = 0.0
TOP_K = 1
TOP_P = 1.0
RETRIES = 2
RETRY_SLEEP_SECONDS = 1.0

PERFECT_EXAMPLES_PER_CLASS = 40  # saved for demo curation

DATASET_NAME = "lytang/LLM-AggreFact"
DATASET_SPLIT = "test"

# If you have slow internet, you can avoid HF dataset downloads in two ways:
# 1) Provide a local parquet path:
#      DATA_PARQUET=/path/to/dev-00000-of-00001.parquet
# 2) Stream from HF (downloads only what you read):
#      STREAMING=1
DATA_PARQUET = os.getenv("DATA_PARQUET", "").strip()
STREAMING = os.getenv("STREAMING", "").strip() in ("1", "true", "yes", "on")

SYSTEM_PROMPT = (
    "You are a fact checking model developed by NehmeAILabs. Determine whether the provided claim is consistent with the corresponding document. "
    "Consistency in this context implies that all information presented in the claim is substantiated by the document. If not, it should be considered inconsistent. "
    "Please assess the claim's consistency with the document by responding with either \"Yes\" or \"No\"."
)


def normalize_pred(text: str) -> Optional[Literal["yes", "no"]]:
    cleaned = (
        (text or "")
        .replace("<end_of_turn>", " ")
        .replace("<eos>", " ")
        .replace("<bos>", " ")
        .replace("<pad>", " ")
        .strip()
    )
    if not cleaned:
        return None

    # Prefer explicit yes/no anywhere (e.g. "Answer: No")
    lower = cleaned.lower()
    if "yes" in lower.split():
        return "yes"
    if "no" in lower.split():
        return "no"

    # Fallback: first token stripping punctuation
    first = cleaned.split()[0].strip().strip(".").strip(",").strip('"').strip("'")
    token = "".join(ch for ch in first if ch.isalpha() or ch == "_").lower()
    if token in ("yes", "no"):
        return token  # type: ignore[return-value]
    if token == "label_1":
        return "yes"
    if token == "label_0":
        return "no"
    if token in ("entailment", "supported", "supports"):
        return "yes"
    if token in ("contradiction", "refuted", "unsupported"):
        return "no"
    return None


def expected_from_label(label: int) -> Literal["yes", "no"]:
    # Dataset label: 1 = supported (Yes), 0 = unsupported (No)
    return "yes" if label == 1 else "no"


def build_user_prompt(doc: str, claim: str) -> str:
    # Required format for FlashCheck
    return f"Document: {doc}\n\nClaim: {claim}"


def ollama_yes_no(doc: str, claim: str) -> Tuple[Optional[Literal["yes", "no"]], str]:
    messages: List[Dict[str, str]] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": build_user_prompt(doc, claim)},
    ]

    last_err: Optional[BaseException] = None
    for attempt in range(RETRIES + 1):
        try:
            resp: Dict[str, Any] = ollama.chat(
                model=OLLAMA_MODEL,
                messages=messages,
                options={
                    "temperature": TEMPERATURE,
                    "top_k": TOP_K,
                    "top_p": TOP_P,
                    "num_predict": MAX_NEW_TOKENS,
                },
            )
            content = ((resp.get("message") or {}).get("content") or "").strip()
            return normalize_pred(content), content
        except BaseException as e:
            last_err = e
            if attempt < RETRIES:
                time.sleep(RETRY_SLEEP_SECONDS)
                continue
            raise

    raise RuntimeError(f"unreachable (last_err={last_err})")


def iter_sample_rows() -> Tuple[object, int]:
    """
    Returns (iterator, total) where iterator yields rows as dicts.
    If STREAMING=1, we don't download the whole dataset; we only read enough rows for SAMPLE_SIZE.
    If DATA_PARQUET is set, we load from local parquet without HF download.
    """
    if DATA_PARQUET:
        print(f"Loading from local parquet: {DATA_PARQUET}")
        ds = load_dataset("parquet", data_files=DATA_PARQUET, split="train")
        ds = ds.shuffle(seed=SHUFFLE_SEED).select(range(min(SAMPLE_SIZE, len(ds))))
        return iter(ds), len(ds)

    if STREAMING:
        print(f"Streaming from HF dataset: {DATASET_NAME} ({DATASET_SPLIT})")
        ds = load_dataset(DATASET_NAME, split=DATASET_SPLIT, streaming=True)
        # IterableDataset shuffle is approximate; buffer_size controls memory and quality of shuffle.
        ds = ds.shuffle(seed=SHUFFLE_SEED, buffer_size=10_000)
        return itertools.islice(iter(ds), SAMPLE_SIZE), SAMPLE_SIZE

    print(f"Loading HF dataset: {DATASET_NAME} ({DATASET_SPLIT})")
    ds = load_dataset(DATASET_NAME, split=DATASET_SPLIT)
    ds = ds.shuffle(seed=SHUFFLE_SEED).select(range(min(SAMPLE_SIZE, len(ds))))
    return iter(ds), len(ds)


def main() -> None:
    rows_iter, total = iter_sample_rows()
    print(f"Running {total} samples using Ollama model: {OLLAMA_MODEL}")

    results: List[Dict[str, Any]] = []
    perfect_yes: List[Dict[str, Any]] = []
    perfect_no: List[Dict[str, Any]] = []

    for row in tqdm(rows_iter, total=total):
        doc = row["doc"]
        claim = row["claim"]
        label = int(row["label"])
        expected = expected_from_label(label)

        pred, raw = ollama_yes_no(doc, claim)
        correct = pred == expected

        results.append(
            {
                "dataset": row.get("dataset"),
                "expected": expected,
                "prediction": pred,
                "correct": bool(correct),
                "raw_output": raw,
                "doc": doc,
                "claim": claim,
            }
        )

        if correct:
            item = {"document": doc, "claim": claim, "expected": expected}
            if expected == "yes" and len(perfect_yes) < PERFECT_EXAMPLES_PER_CLASS:
                perfect_yes.append(item)
            elif expected == "no" and len(perfect_no) < PERFECT_EXAMPLES_PER_CLASS:
                perfect_no.append(item)

    df = pd.DataFrame(results)
    out_csv = "aggrefact_ollama_flashcheck_200.csv"
    df.to_csv(out_csv, index=False)
    print(f"\nSaved full results: {out_csv}")

    print("\n==============================")
    print("OVERALL PERFORMANCE (sample)")
    print("==============================")
    print(f"Accuracy: {df['correct'].mean() * 100:.2f}%")

    if "dataset" in df.columns:
        print("\n==============================")
        print("PERFORMANCE BY DATASET (sample)")
        print("==============================")
        print((df.groupby("dataset")["correct"].mean() * 100).sort_values(ascending=False))

    with open("perfect_examples_yes.jsonl", "w", encoding="utf-8") as f:
        for ex in perfect_yes:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")
    with open("perfect_examples_no.jsonl", "w", encoding="utf-8") as f:
        for ex in perfect_no:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")

    print(f"\nSaved perfect YES examples: perfect_examples_yes.jsonl ({len(perfect_yes)})")
    print(f"Saved perfect NO examples:  perfect_examples_no.jsonl ({len(perfect_no)})")


if __name__ == "__main__":
    main()
