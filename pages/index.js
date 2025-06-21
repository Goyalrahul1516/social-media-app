import { auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthPage from '../components/AuthPage';
import ProfileForm from '../components/ProfileForm';
import PostFeed from '../components/PostFeed';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <AuthPage />;
  
  return (
    <div className="container">
      <h1>Welcome to Simple Social!</h1>
      <ProfileForm />
      <PostFeed />
    </div>
  );
}