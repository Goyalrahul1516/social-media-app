import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthPage from '@/components/AuthPage';
import ProfileForm from '@/components/ProfileForm';
import PostFeed from '@/components/PostFeed';
import Layout from '@/components/Layout';
import styles from '../styles/modules/Home.module.css';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  
  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>Loading...</div>
      </Layout>
    );
  }
  
  if (!user) {
    return (
      <Layout>
        <AuthPage />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className={styles.appContainer}>
        <h1 className={styles.appTitle}>Welcome to Simple Social!</h1>
        <div className={styles.contentGrid}>
          <div className={styles.profileSection}>
            <ProfileForm />
          </div>
          <div className={styles.postsSection}>
            <PostFeed />
          </div>
        </div>
      </div>
    </Layout>
  );
}