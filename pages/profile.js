import Layout from '@/components/Layout';
import ProfileForm from '@/components/ProfileForm';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ProfilePage() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (!user) return <Layout><div>Please login to view your profile.</div></Layout>;

  return (
    <Layout>
      <ProfileForm />
    </Layout>
  );
}