import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ForumPost() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', caption: '', category: '', images: [] });
  const [newComment, setNewComment] = useState({ postId: '', caption: '', image: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/message/forum/posts');
      setPosts(response.data.responseData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts');
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('caption', newPost.caption);
    formData.append('category', newPost.category);
    newPost.images.forEach((image) => formData.append('images', image));

    try {
      const response = await axios.post('http://localhost:3000/api/forum/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts([response.data.responseData, ...posts]);
      setNewPost({ title: '', caption: '', category: '', images: [] });
    } catch (error) {
      console.error('Error submitting post:', error);
      setError('Failed to submit post');
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caption', newComment.caption);
    formData.append('image', newComment.image);

    try {
      const response = await axios.post(`http://localhost:3000/api/forum/comment?post_id=${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedPosts = posts.map((post) =>
        post._id === postId ? response.data.responseData : post
      );
      setPosts(updatedPosts);
      setNewComment({ postId: '', caption: '', image: null });
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment');
    }
  };

  const handleImageChange = (e) => {
    setNewPost({ ...newPost, images: [...e.target.files] });
  };

  const handleCommentImageChange = (e) => {
    setNewComment({ ...newComment, image: e.target.files[0] });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-yellow-800 mb-4">Forum Posts</h1>

      <form onSubmit={handlePostSubmit} className="mb-4">
        <input
          type="text"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          placeholder="Title"
        />
        <textarea
          value={newPost.caption}
          onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          placeholder="Caption"
        />
        <input
          type="text"
          value={newPost.category}
          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          placeholder="Category"
        />
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Submit
        </button>
      </form>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No posts found.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="border border-yellow-100 rounded-lg p-4 hover:bg-yellow-50 transition-colors">
                <h2 className="text-lg font-semibold text-yellow-800">{post.title}</h2>
                <p className="text-sm text-gray-800">{post.caption}</p>
                <p className="text-xs text-gray-500 mt-2">Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
                {post.images && post.images.length > 0 && (
                  <div className="mt-2">
                    {post.images.map((image, index) => (
                      <img key={index} src={`http://localhost:3000/uploads/${image}`} alt="Post" className="w-full h-auto mb-2" />
                    ))}
                  </div>
                )}
                <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="mt-4">
                  <textarea
                    value={newComment.caption}
                    onChange={(e) => setNewComment({ ...newComment, caption: e.target.value, postId: post._id })}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Write a comment..."
                  />
                  <input
                    type="file"
                    onChange={handleCommentImageChange}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                    Submit
                  </button>
                </form>
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold text-yellow-800">Comments</h3>
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="border-t border-yellow-100 pt-2 mt-2">
                        <p className="text-sm text-gray-800">{comment.caption}</p>
                        {comment.image && (
                          <img src={`http://localhost:3000/uploads/${comment.image}`} alt="Comment" className="w-full h-auto mt-2" />
                        )}
                        <p className="text-xs text-gray-500 mt-2">Commented on {new Date(comment.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ForumPost;