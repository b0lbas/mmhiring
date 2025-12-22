import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

export default function Blog() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Welcome to the MatchMakers Blog!',
      content: 'This is your first blog post. Start sharing your insights!',
      image: '',
      date: new Date().toISOString().substring(0, 10)
    }
  ]);
  const [editing, setEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState({ id: null, title: '', content: '', image: '', date: '' });
  const [adminMode, setAdminMode] = useState(false);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCurrentPost({ ...currentPost, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleChange(e) {
    setCurrentPost({ ...currentPost, [e.target.name]: e.target.value });
  }

  function handleEdit(post) {
    setEditing(true);
    setCurrentPost(post);
  }

  function handleDelete(id) {
    setPosts(posts.filter(post => post.id !== id));
    setEditing(false);
    setCurrentPost({ id: null, title: '', content: '', image: '', date: '' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      setPosts(posts.map(post => post.id === currentPost.id ? currentPost : post));
    } else {
      setPosts([
        ...posts,
        { ...currentPost, id: Date.now(), date: new Date().toISOString().substring(0, 10) }
      ]);
    }
    setEditing(false);
    setCurrentPost({ id: null, title: '', content: '', image: '', date: '' });
  }

  return (
    <>
      <Head>
        <title>Blog | MatchMakers Hiring</title>
        <meta name="description" content="Insights and updates from MatchMakers." />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-blue pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-bold text-white font-display">Blog</h1>
            <button
              className="bg-gradient-pink text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-glow transition-all duration-300"
              onClick={() => setAdminMode(!adminMode)}
            >
              {adminMode ? 'Exit Admin' : 'Admin Login'}
            </button>
          </div>

          {adminMode && (
            <form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-xl mb-8 shadow-glass max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-white">{editing ? 'Edit Post' : 'Add New Post'}</h2>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={currentPost.title}
                onChange={handleChange}
                className="w-full mb-4 p-3 rounded border border-white/20 bg-white/5 text-white focus:outline-none"
                required
              />
              <textarea
                name="content"
                placeholder="Content"
                value={currentPost.content}
                onChange={handleChange}
                className="w-full mb-4 p-3 rounded border border-white/20 bg-white/5 text-white h-32 focus:outline-none"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4 text-white"
              />
              {currentPost.image && (
                <div className="mb-4">
                  <img src={currentPost.image} alt="Preview" className="max-h-40 rounded-xl mx-auto" />
                </div>
              )}
              <div className="flex space-x-4">
                <button type="submit" className="bg-gradient-pink px-6 py-2 rounded-full text-white font-semibold shadow-lg hover:shadow-glow transition-all duration-300">
                  {editing ? 'Update Post' : 'Add Post'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(false); setCurrentPost({ id: null, title: '', content: '', image: '', date: '' }); }} className="bg-gray-500 px-6 py-2 rounded-full text-white font-semibold">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <div key={post.id} className="bg-white/10 p-8 rounded-xl shadow-glass flex flex-col">
                {post.image && (
                  <img src={post.image} alt={post.title} className="mb-4 rounded-xl max-h-40 w-full object-cover" />
                )}
                <h2 className="text-2xl font-bold text-white mb-2 font-display">{post.title}</h2>
                <p className="text-gray-300 mb-4">{post.content}</p>
                <span className="text-xs text-gray-400">{post.date}</span>
                {adminMode && (
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => handleEdit(post)} className="bg-blue-500 px-4 py-1 rounded-full text-white font-semibold">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="bg-red-500 px-4 py-1 rounded-full text-white font-semibold">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
