import { NextPageContext } from 'next';
import { getSession, signOut } from 'next-auth/react';
import useCurrentUser from '@/hooks/useCurrentUser';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    };
  }

  return {
    props: {}
  };
}

export default function Home() {
  const { user } = useCurrentUser();

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}