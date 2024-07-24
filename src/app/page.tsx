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
    <div className="flex flex-col items-center justify-center m-4 md:m-20">
      <h1 className="text-2xl font-bold mb-6">Social Media Post Generator</h1>
      <form onSubmit={generatePost} className="flex flex-col items-center w-full mb-10">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="w-full md:w-96 p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Post'}
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {post && (
        <div className="bg-white p-4 rounded-md shadow-md w-full md:w-96 mb-10">
          <h2 className="text-xl font-semibold mb-2">Generated Post</h2>
          <p>{post}</p>
        </div>
      )}
      <div className="w-full md:w-96">
        <p className="font-bold text-lg mb-4">Previous Posts</p>
        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post, index) => (
              <li key={index} className="bg-white p-4 rounded-md shadow-md border border-gray-300">
                <strong>{new Date(post.timestamp).toLocaleString()}:</strong> {post.post}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
