import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/components/chat-message';
import { Message } from './chat';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export interface ChatList {
  messages: Message[];
  ModalClose: boolean;
  setModalClose: (value: boolean) => void;
}

export function ChatList({ messages, ModalClose, setModalClose }: ChatList) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const param = useParams();

  const resolveTicket = useMutation({
    mutationFn: (id: number) =>
      fetch(
        `https://backend-production-dbba.up.railway.app/api/tickets/${id}/close`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    onSuccess: () => {
      toast.success('The ticket was solved successfully!');
      queryClient.invalidateQueries();
      router.push('/');
    },
  });

  if (!messages.length) {
    return null;
  }
  return (
    <>
      <div className='relative mx-auto max-w-2xl px-4'>
        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage message={message} />
            {index < messages.length - 1 && (
              <Separator className='my-4 md:my-8' />
            )}
          </div>
        ))}
        {ModalClose && (
          <div className='flex items-center justify-end  md:-right-10 md:-top-2 '>
            <Button
              variant='outline'
              onClick={() => setModalClose(false)}
              className='bg-background'
            >
              Sugerencias
            </Button>
            <Button
              variant='outline'
              onClick={() => resolveTicket.mutate(parseInt(param.id))}
              className='bg-green-300 border-green-300 ml-3'
            >
              Resolver Ticket
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
