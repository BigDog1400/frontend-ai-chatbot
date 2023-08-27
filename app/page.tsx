'use client';

import { useEffect } from 'react';
import { nanoid } from '@/lib/utils';
import { Chat } from '@/components/chat';
import { useRouter } from 'next/navigation';

export const runtime = 'edge';

export default function IndexPage() {
  const id = nanoid();
  const router = useRouter();

  // useEffect(() => {
  //   router.push('/chat/1');
  // }, [router]);

  return <Chat id={"2"} />;
}
