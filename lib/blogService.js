import fs from 'fs';
import path from 'path';
import slugify from 'slugify';

const DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initial data if file doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

export const blogService = {
    getAllPosts: async () => {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    },

    getPostBySlug: async (slug) => {
        const posts = await blogService.getAllPosts();
        return posts.find(p => p.slug === slug);
    },

    getPostById: async (id) => {
        const posts = await blogService.getAllPosts();
        return posts.find(p => p.id === id);
    },

    savePost: async (postData) => {
        const posts = await blogService.getAllPosts();
        const now = new Date().toISOString();

        let post;
        const existingIndex = posts.findIndex(p => p.id === postData.id);

        if (existingIndex >= 0) {
            // Update
            post = {
                ...posts[existingIndex],
                ...postData,
                updatedAt: now,
                revisions: [
                    ...(posts[existingIndex].revisions || []),
                    { date: now, content: posts[existingIndex].content } // Simple revision tracking
                ]
            };
            posts[existingIndex] = post;
        } else {
            // Create
            post = {
                id: Date.now().toString(),
                createdAt: now,
                updatedAt: now,
                views: 0,
                revisions: [],
                ...postData,
                slug: postData.slug || slugify(postData.title, { lower: true, strict: true })
            };
            posts.push(post);
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
        return post;
    },

    deletePost: async (id) => {
        let posts = await blogService.getAllPosts();
        posts = posts.filter(p => p.id !== id);
        fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
    },

    incrementView: async (slug) => {
        const posts = await blogService.getAllPosts();
        const index = posts.findIndex(p => p.slug === slug);
        if (index >= 0) {
            posts[index].views = (posts[index].views || 0) + 1;
            fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
        }
    }
};
