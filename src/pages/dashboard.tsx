import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import CoursesDropdown from '../components/CoursesDropdown';

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return; 
    if (!session) router.push('/'); 
  }, [session, status, router]);

  if (!session) return null; 

  return (
    <Layout>
      {(loading) ? <Loading /> : null}
      <div className="mt-8 text-center">
        <CoursesDropdown />
      </div>
    </Layout>
  );
};

export default Dashboard;