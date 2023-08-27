'use client';

import { useEffect } from 'react';
import { nanoid } from '@/lib/utils';
import { Chat } from '@/components/chat';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export const runtime = 'edge';

export interface Root {
  _id: string
  initialContext: string
  status: string
  chat: Chat
  number: number
  reason: string
  userId: number
  created_at: string
  updated_at: string
}

export interface Chat {
  messages: Message[]
  suggest: Suggest[]
}

export interface Message {
  senderBy: string
  content: string
  createAt: string
}

export interface Suggest {
  options: string[]
  suggests: string[]
}


export default function IndexPage() {
  const router = useRouter();
  const chatQuery = useQuery<Root[]>({
    queryKey: ['tickets'],
    queryFn: () =>
      fetch(
        `https://backend-production-dbba.up.railway.app/api/tickets`,
      ).then(res => res.json()),
    refetchInterval: 5000,
  });

   useEffect(() => {
    if(!chatQuery.data) return;
    if(chatQuery.data.length === 0) return;
    if(chatQuery.isRefetching) return;
    router.push(`/chat/${chatQuery.data[0].number}`);
  }, [router, chatQuery.data, chatQuery.isRefetching]);

  if (chatQuery.isLoading) return <p>Loading...</p>;
  if (chatQuery.isError) return null;

 

  
  return null;
}
