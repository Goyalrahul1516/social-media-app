import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <div className="auth-form">
      <h2>Login/Sign Up</h2>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password"
      />
      <div className="button-group">
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
}