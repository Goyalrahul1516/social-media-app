import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        res.status(200).json(docSnap.data());
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  } 
  else if (req.method === 'POST') {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...req.body,
        updatedAt: new Date()
      }, { merge: true });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}