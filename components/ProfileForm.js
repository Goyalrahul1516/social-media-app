import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function ProfileForm() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().name || '');
          setBio(docSnap.data().bio || '');
        }
      }
    };
    fetchProfile();
  }, []);
  
  const handleSubmit = async () => {
    if (auth.currentUser) {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        name,
        bio,
        updatedAt: new Date()
      }, { merge: true });
      alert('Profile saved!');
    }
  };
  
  return (
    <div className="profile-form">
      <h2>Your Profile</h2>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Your Name"
      />
      <textarea 
        value={bio} 
        onChange={(e) => setBio(e.target.value)} 
        placeholder="Tell us about yourself"
      />
      <button onClick={handleSubmit}>Save Profile</button>
    </div>
  );
}