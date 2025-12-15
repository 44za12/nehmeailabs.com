#!/usr/bin/env bash
set -euo pipefail

# Minimal server-side deploy helper (run AFTER SSH'ing into the server).
#
# Usage:
#   cd ~/nehmeailabs.com
#   ./scripts/deploy.sh
#
# Optional:
#   DEPLOY_BRANCH=main
#   DEPLOY_DIR=~/nehmeailabs.com
#   DEPLOY_NVM_VERSION=20.19.6
#   DEPLOY_PM2_APP=nehmeailabs.com
#   DEPLOY_PORT=3005
#   DEPLOY_RELOAD_NGINX=1
#

: "${DEPLOY_DIR:=${PWD}}"
: "${DEPLOY_BRANCH:=main}"
: "${DEPLOY_NVM_VERSION:=20.19.6}"
: "${DEPLOY_PM2_APP:=nehmeailabs.com}"
: "${DEPLOY_PORT:=3005}"
: "${DEPLOY_RELOAD_NGINX:=0}"

echo "Deploying in ${DEPLOY_DIR} (branch: ${DEPLOY_BRANCH})"

cd "${DEPLOY_DIR}"

if [ -f "${HOME}/.nvm/nvm.sh" ]; then
	# shellcheck disable=SC1090
	source "${HOME}/.nvm/nvm.sh"
	nvm use "${DEPLOY_NVM_VERSION}" >/dev/null
fi

echo "[1/6] git fetch + checkout"
git fetch --all --prune
git checkout "${DEPLOY_BRANCH}"
git pull --ff-only

echo "[2/6] install deps"
npm ci

echo "[3/6] build"
npm run build

echo "[4/6] pm2 reload"
pm2 reload ecosystem.config.cjs --only "${DEPLOY_PM2_APP}" || pm2 start ecosystem.config.cjs --only "${DEPLOY_PM2_APP}"
pm2 save

if [ "${DEPLOY_RELOAD_NGINX}" = "1" ]; then
	echo "[5/6] nginx reload"
	nginx -t
	systemctl reload nginx
fi

echo "[6/6] health check"
curl -fsS -I "http://127.0.0.1:${DEPLOY_PORT}" | head -n 1 || true

echo "Done."


