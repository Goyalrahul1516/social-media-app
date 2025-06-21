import { useState, useEffect } from 'react';
import styles from '../styles/modules/Posts.module.css';

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handlePostSubmit = async () => {
    if (newPost.trim()) {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newPost,
            userId: 'current-user-id', // Replace with actual user ID
            userName: 'Current User'   // Replace with actual username
          }),
        });
        
        if (response.ok) {
          const newPostData = await response.json();
          setPosts([newPostData, ...posts]);
          setNewPost('');
        }
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`/api/likes?postId=${postId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const { newLikes } = await response.json();
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, likes: newLikes } : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className={styles.postFeed}>
      <div className={styles.postForm}>
        <textarea 
          value={newPost} 
          onChange={(e) => setNewPost(e.target.value)} 
          placeholder="What's on your mind?"
          className={styles.postInput}
        />
        <button 
          onClick={handlePostSubmit}
          className={styles.postButton}
          disabled={!newPost.trim()}
        >
          Post
        </button>
      </div>
      
      <div className={styles.postsContainer}>
        {posts.map(post => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postHeader}>
              <span className={styles.postAuthor}>{post.userName}</span>
              <span className={styles.postTime}>
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            <p className={styles.postContent}>{post.content}</p>
            <div className={styles.postActions}>
              <button 
                onClick={() => handleLike(post.id)}
                className={styles.likeButton}
              >
                👍 Like ({post.likes})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}