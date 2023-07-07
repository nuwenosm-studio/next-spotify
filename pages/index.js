import Sidebar from '@/components/Sidebar';
import Center from '@/components/center/Center';
import Player from '@/components/center/Player';

import { getSession } from 'next-auth/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
   return (
      <div className="bg-black h-screen overflow-hidden">
         <main className="flex">
            <Sidebar />
            <Center />
         </main>

         <div className="sticky bottom-0">
            <Player />
         </div>
      </div>
   )
}

export async function getServerSideProps(context) {
   const session = await getSession(context);

   return {
      props: {
         session
      }
   }
}
