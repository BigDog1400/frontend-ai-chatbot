'use client';
import { ChatList } from '@/components/chat-list';
import { ChatPanel } from '@/components/chat-panel';
import { EmptyScreen } from '@/components/empty-screen';
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'react-hot-toast';
import { TextHint } from './text-hint';
import clsx from 'clsx';
import { XIcon } from './ui/icons';
import { useAtBottom } from '@/lib/hooks/use-at-bottom';
import { IconArrowDown } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { Chats } from '@/app/chat/[id]/page';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';

const URL = process.env.API_URL;

export interface Root {
  messages: Message[]
  suggest: Suggest[]
}


export interface Suggest {
  options: string[]
  suggests: string[]
}

export interface Message {
  senderBy: 'client' | 'costumerService'
  content: string
  createAt: string
}







export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;

  /** new props for our example */
  chats: Chats
}

export function Chat({ id, initialMessages, className, chats }: ChatProps) {
  const queryClient = useQueryClient();
  const chatQuery = useQuery<Root>({
    queryKey: ['tickets-chat', id],
    queryFn: () =>
      fetch(`https://backend-production-dbba.up.railway.app/api/tickets/${id}/chats`).then(
        res => res.json(),
      ),
    refetchInterval: 5000,
  });

  const chatMessageMutation = useMutation({
    mutationFn: (payload:{
      senderBy: 'customerService',
      content: string,
    }) =>
      fetch(`https://backend-production-dbba.up.railway.app/api/tickets/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload }),
      }),
    onSuccess: () => {
      toast.success('Message sent!');
      queryClient.invalidateQueries();
      setInput('');
    },
  });

  console.log({ data: chatQuery.data })
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null,
  );
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const scrollContainerRef = useRef(null);
  const [ModalClose, setModalClose] = useState(true);
  const [previewTokenInput, setPreviewTokenInput] = useState(
    previewToken ?? '',
  );
  const [input, setInput] = useState('');


  if(chatQuery.isLoading) return <p>Loading...</p>
  if(chatQuery.isError) return <p>Error...</p>

  return (
    <>
      <aside className='inset-y-0 left-72 w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 h-full'>
        <div className='col-span-1 flex gap-2 flex-col mx-auto mt-20'>

             <div
              className={`rounded-lg border bg-background p-8 ${true ? 'border-blue-500' : 'border-gray-300'} cursor-pointer`}
            >
              <div className='font-bold text-2xl'>
                Jonh Doe
              </div>
            </div>
          
        </div>
      </aside>

      <div
        ref={scrollContainerRef}
        className={cn(
          'pb-[420px] pt-28 mx-auto w-full px-4 max-w-4xl h-screen overflow-y-scroll relative',
          className,
        )}
      >
        <ChatList
          messages={chatQuery.data?.messages ?? []}
          ModalClose={ModalClose}
          setModalClose={setModalClose}
        />
        <div
          className={clsx('', {
            'lg:mt-[510px] mt-[320px]': chatQuery.data?.messages?.length === 0,
          })}
        >
          <div
            className={clsx('mx-auto max-w-2xl px-4 ', {
              hidden: ModalClose,
            })}
          >
            <div className='rounded-lg border bg-background p-8 relative'>
              {chatQuery.data?.messages?.length! > 0 && (
                <button
                  onClick={() => setModalClose(true)}
                  type='button'
                  className='absolute top-4 right-4 w-6 h-6 cursor-pointer'
                >
                  <XIcon />
                </button>
              )}

            </div>
          </div>
        </div>

        <ChatScrollAnchor trackVisibility={chatQuery.isLoading} />
      </div>
      <Button
        variant='outline'
        size='icon'
        className={clsx(
          'absolute right-4 top-20 z-10 bg-background transition-opacity duration-300 sm:right-8  ',
          className,
        )}
        onClick={() => {
          if (scrollContainerRef.current) {
            const element = scrollContainerRef.current;
            // @ts-ignore
            element.scrollTop = element.scrollHeight;
          }
        }}
      >
        <IconArrowDown />

        <span className='sr-only'>Scroll to bottom</span>
      </Button>
      <ChatPanel
        isLoading={chatQuery.isLoading}
        append={(message) => {
          chatMessageMutation.mutate({
            senderBy: 'customerService',
            content: message,
          });
        }}
        input={input}
        setInput={setInput}
      />

      {/* <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href='https://platform.openai.com/signup/'
                className='underline'
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className='font-mono'>ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder='OpenAI API key'
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className='items-center'>
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput);
                setPreviewTokenDialog(false);
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
