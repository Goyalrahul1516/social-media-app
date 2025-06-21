import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData.sort((a, b) => b.createdAt - a.createdAt));
    };
    fetchPosts();
  }, []);
  
  const handlePostSubmit = async () => {
    if (auth.currentUser && newPost.trim()) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const userName = userDoc.exists() ? userDoc.data().name : 'Anonymous';
      
      await addDoc(collection(db, 'posts'), {
        content: newPost,
        userId: auth.currentUser.uid,
        userName,
        likes: 0,
        createdAt: new Date()
      });
      setNewPost('');
      window.location.reload(); // Refresh to see new post
    }
  };
  
  const handleLike = async (postId, currentLikes) => {
    await updateDoc(doc(db, 'posts', postId), {
      likes: currentLikes + 1
    });
    window.location.reload(); // Refresh to see updated likes
  };
  
  return (
    <div className="post-feed">
      <h2>Create Post</h2>
      <textarea 
        value={newPost} 
        onChange={(e) => setNewPost(e.target.value)} 
        placeholder="What's on your mind?"
      />
      <button onClick={handlePostSubmit}>Post</button>
      
      <h2>Feed</h2>
      {posts.map(post => (
        <div key={post.id} className="post">
          <h3>{post.userName}</h3>
          <p>{post.content}</p>
          <button onClick={() => handleLike(post.id, post.likes)}>
            👍 Like ({post.likes})
          </button>
        </div>
      ))}
    </div>
  );
}