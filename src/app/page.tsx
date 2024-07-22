'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [post, setPost] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [posts, setPosts] = useState<Array<{ timestamp: string, prompt: string, post: string }>>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/fetch-posts');
      setPosts(response.data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const generatePost = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/generate-post', { prompt });
      setPost(response.data.post);
      fetchPosts(); // Refresh the posts list
    } catch (err) {
      setError('Error generating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Social Media Post Generator</h1>
      <form onSubmit={generatePost}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Post'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {post && (
        <div>
          <h2>Generated Post</h2>
          <p>{post}</p>
        </div>
      )}
      <div>
        <h2>Previous Posts</h2>
        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          <ul>
            {posts.map((post, index) => (
              <li key={index}>
                <strong>{new Date(post.timestamp).toLocaleString()}:</strong> {post.post}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
