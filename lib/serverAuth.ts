import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import prismaDb from '@/lib/prismaDb';

const serverAuth = async (req: NextApiRequest) => {
  const session = await getSession({ req });

  if (!session?.user?.email) {
    throw new Error('Not signed in');
  }

  const currentUser = await prismaDb.user.findUnique({
    where: { email: session.user.email }
  });

  if (!currentUser) {
    throw new Error('Not signed in');
  }

  return { currentUser };
};

export default serverAuth;