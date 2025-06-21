import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toMillis()
      }));
      res.status(200).json(posts.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  } 
  else if (req.method === 'POST') {
    try {
      const { content, userId, userName } = req.body;
      const newPost = {
        content,
        userId,
        userName,
        likes: 0,
        createdAt: new Date()
      };
      const docRef = await addDoc(collection(db, 'posts'), newPost);
      res.status(201).json({ id: docRef.id, ...newPost });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}