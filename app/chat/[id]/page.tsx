import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

export const runtime = 'edge'
export const preferredRegion = 'home'
const URL = process.env.API_URL;

export interface ChatPageProps {
  params: {
    id: string
  }
}


export type Chats = {
  senderBy: 'client' | 'customerService';
  content: string;
  createAt: Date;
}[];

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()
  const chats = await fetch(`${URL}/api/tickets/${params.id}/chats`)
    .then<Chats>(res => res.json())
    .catch(err => console.log(err));

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  console.log({ chats })

  if (!chats) {
    notFound()
  }

  // if (chat?.userId !== session?.user?.id) {
  //   notFound()
  // }

  return <Chat
    id={params.id}
  />
}
