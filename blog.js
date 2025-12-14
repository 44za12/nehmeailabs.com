document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const postContent = document.getElementById('post-content');

    if (postsContainer) {
        // We are on the blog listing page
        fetchPosts();
    } else if (postContent) {
        // We are on a single post page
        loadPost();
    }
});

async function fetchPosts() {
    try {
        // In a real scenario, this would be a call to a CMS or a static site generator's index
        const posts = [
            {
                slug: 'introducing-flashcheck',
                title: 'Introducing FlashCheck: The Anti-Hallucination Engine',
                date: '2025-12-12',
                excerpt: 'LLMs hallucinate. It’s a fundamental flaw that erodes trust and introduces risk. We built a better way. Introducing FlashCheck, a purpose-built verification engine that provides a simple "Yes" or "No" answer to any claim, enabling a new paradigm of provably accurate AI.'
            }
        ];

        const postsContainer = document.getElementById('posts-container');
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts found.</p>';
            return;
        }

        const postCards = posts.map(post => `
            <a href="post.html?slug=${post.slug}" class="post-card">
                <div class="post-card-content">
                    <h2 class="post-card-title">${post.title}</h2>
                    <p class="post-card-excerpt">${post.excerpt}</p>
                    <div class="post-card-meta">
                        <span class="post-card-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span class="post-card-readmore">Read More <span class="arrow">→</span></span>
                    </div>
                </div>
            </a>
        `).join('');

        postsContainer.innerHTML = postCards;

    } catch (error) {
        console.error('Error fetching posts:', error);
        document.getElementById('posts-container').innerHTML = '<p>Error loading posts. Please try again later.</p>';
    }
}

async function loadPost() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        if (!slug) {
            window.location.href = 'blog.html';
            return;
        }

        const response = await fetch(`posts/${slug}.md`);
        if (!response.ok) {
            throw new Error('Post not found');
        }
        const markdown = await response.text();
        
        // Extract title and date from frontmatter
        const { attributes, body } = parseFrontmatter(markdown);

        document.title = `${attributes.title} | Nehme AI Labs`;
        
        const postHeader = document.querySelector('.post-header');
        const postContent = document.getElementById('post-content');

        postHeader.innerHTML = `
            <h1 class="post-title">${attributes.title}</h1>
            <p class="post-meta">Published on ${new Date(attributes.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        `;
        
        postContent.innerHTML = marked.parse(body);

    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-content').innerHTML = '<p>The requested post could not be found. <a href="blog.html">Return to blog</a>.</p>';
    }
}

function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
    const match = frontmatterRegex.exec(markdown);
    
    if (!match) {
        return { attributes: {}, body: markdown };
    }
    
    const frontmatter = match[1];
    const body = markdown.slice(match[0].length);
    
    const attributes = {};
    frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            attributes[key.trim()] = valueParts.join(':').trim();
        }
    });
    
    return { attributes, body };
}
