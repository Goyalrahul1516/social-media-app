import Head from 'next/head';
import styles from '../styles/modules/Layout.module.css';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Layout({ children }) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Simple Social</title>
        <meta name="description" content="A simple social media platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          Simple Social
        </div>
        <nav>
          {user ? (
            <>
              <button className={styles.navButton} onClick={() => router.push('/')}>Home</button>
              <button className={styles.navButton} onClick={() => router.push('/profile')}>Profile</button>
              <button className={styles.navButton} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className={styles.navButton} onClick={() => router.push('/')}>Home</button>
          )}
        </nav>
      </header>
      <main className={styles.container}>
        {children}
      </main>
    </>
  );
}