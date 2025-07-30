document.addEventListener('DOMContentLoaded', () => {
    const blogPostForm = document.getElementById('blog-post-form');
    const postTitleInput = document.getElementById('post-title');
    const postContentTextarea = document.getElementById('post-content');
    const postsContainer = document.getElementById('posts-container');

    // Function to get posts from local storage
    const getPosts = () => {
        const posts = localStorage.getItem('blogPosts');
        return posts ? JSON.parse(posts) : [];
    };

    // Function to save posts to local storage
    const savePosts = (posts) => {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    };

    // Function to display posts
    const displayPosts = () => {
        postsContainer.innerHTML = ''; // Clear existing posts
        const posts = getPosts();

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts yet. Be the first to publish!</p>';
            return;
        }

        posts.forEach((post) => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.split('\n').map(p => `<p>${p}</p>`).join('')}</p>
                <div class="post-meta">
                    <span>Published on: ${new Date(post.timestamp).toLocaleDateString()} at ${new Date(post.timestamp).toLocaleTimeString()}</span>
                    <button data-id="${post.id}">Delete</button>
                </div>
            `;
            postsContainer.appendChild(postCard);
        });
    };

    // Handle form submission
    blogPostForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const title = postTitleInput.value.trim();
        const content = postContentTextarea.value.trim();

        if (title && content) {
            const posts = getPosts();
            const newPost = {
                id: Date.now(), // Unique ID for the post
                title,
                content,
                timestamp: new Date().toISOString()
            };
            posts.unshift(newPost); // Add new post to the beginning
            savePosts(posts);
            displayPosts();

            // Clear the form
            postTitleInput.value = '';
            postContentTextarea.value = '';
        } else {
            alert('Please fill in both the title and content fields.');
        }
    });

    // Handle post deletion using event delegation
    postsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' && e.target.hasAttribute('data-id')) {
            const postIdToDelete = parseInt(e.target.dataset.id);
            let posts = getPosts();
            posts = posts.filter(post => post.id !== postIdToDelete);
            savePosts(posts);
            displayPosts();
        }
    });

    // Initial display of posts when the page loads
    displayPosts();
});