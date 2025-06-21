import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import styles from '../styles/modules/Profile.module.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfileForm() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('/images/default-avatar.png');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().name || '');
          setBio(docSnap.data().bio || '');
          setAvatar(docSnap.data().avatar || '/images/default-avatar.png');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setAvatar(url);
    } catch (err) {
      alert('Failed to upload image');
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (auth.currentUser) {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        name,
        bio,
        avatar,
        updatedAt: new Date()
      }, { merge: true });
    }
  };

  return (
    <div className={styles.profileCard}>
      <div className={styles.avatarContainer}>
        <img src={avatar} alt="Profile" className={styles.avatar} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="avatarUpload">Change Profile Image</label>
        <input
          id="avatarUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
          className={styles.inputField}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="name">Your Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.inputField}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="bio">About You</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={styles.textareaField}
          rows="4"
        />
      </div>
      <button onClick={handleSubmit} className={styles.saveButton} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Save Profile'}
      </button>
    </div>
  );
}