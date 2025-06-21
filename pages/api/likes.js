import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { postId } = req.query;

    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const currentLikes = postSnap.data().likes || 0;
      await updateDoc(postRef, { likes: currentLikes + 1 });
      
      res.status(200).json({ success: true, newLikes: currentLikes + 1 });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update likes' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}