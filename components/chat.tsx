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
import { IconArrowRight, XIcon } from './ui/icons';
import { useAtBottom } from '@/lib/hooks/use-at-bottom';
import { IconArrowDown } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { Chats } from '@/app/chat/[id]/page';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';

const URL = process.env.API_URL;

export interface Root {
  messages: Message[];
  suggest: Suggest[];
}

export interface Suggest {
  options: string[];
  suggests: string[];
}

export interface Message {
  senderBy: 'client' | 'costumerService';
  content: string;
  createAt: string;
}

export interface ChatProps extends React.ComponentProps<'div'> {
  id?: string;
}

export function Chat({ id, className }: ChatProps) {
  const queryClient = useQueryClient();
  const chatQuery = useQuery<Root>({
    queryKey: ['tickets-chat', id],
    queryFn: () =>
      fetch(
        `https://backend-production-dbba.up.railway.app/api/tickets/${id}/chats`,
      ).then(res => res.json()),
    refetchInterval: 5000,
  });

  const chatMessageMutation = useMutation({
    mutationFn: (payload: { senderBy: 'customerService'; content: string }) =>
      fetch(
        `https://backend-production-dbba.up.railway.app/api/tickets/${id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...payload }),
        },
      ),
    onSuccess: () => {
      toast.success('Message sent!');
      queryClient.invalidateQueries();
      setInput('');
    },
  });

  console.log({ data: chatQuery.data });
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null,
  );

  const [suggestMessage, setSuggestMessage] = useState('');
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const scrollContainerRef = useRef(null);
  const [ModalClose, setModalClose] = useState(true);
  const [previewTokenInput, setPreviewTokenInput] = useState(
    previewToken ?? '',
  );
  const [input, setInput] = useState('');

  if (chatQuery.isLoading) return <p>Loading...</p>;
  if (chatQuery.isError) return null;

  const copyText = (message: any) => {

    navigator?.clipboard?.writeText(message);
    toast?.success('Copiado!');
    setInput(message);
  };

  return (
    <>
   <aside className='inset-y-0 left-72 w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 h-full'>
        <div className='col-span-1 flex gap-2 flex-col mx-auto mt-20'>
          <div
            className={`rounded-lg border  bg-gray-200 p-8 transition-all ease-in-out duration-200 shadow-smooth ${
              true ? 'border-blue-50' : 'border-gray-300'
            } cursor-pointer`}
          >
            <div className='font-bold text-2xl'>Cliente</div>
          </div>
          <div
            className={`rounded-lg border bg-background p-8 transition-all ease-in-out duration-200 shadow-smooth ${
              true ? 'border-gray-100' : 'border-gray-300'
            } cursor-pointer`}
          >
            <div className='font-bold text-2xl'>Intermediario</div>

            <small>Disabled</small>
          </div>
          <div
            className={`rounded-lg border bg-background p-8 transition-all ease-in-out duration-200 shadow-smooth ${
              true ? 'border-gray-100' : 'border-gray-300'
            } cursor-pointer`}
          >
            <div className='font-bold text-2xl'>Negocio</div>
            <small>Disabled</small>
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
              <h1 className='mb-2 text-lg font-semibold'>Sugerencias:</h1>

              <div className='mt-4 flex lg:flex-col flex-col items-start lg:space-x-0 lg:space-y-3 space-y-3'>
                {chatQuery.data?.suggest?.[0]?.options?.map(
                  (message, index) => (
                    <Button
                      key={'dd' + index}
                      variant='secondary'
                      className='h-auto py-1 px-3 text-base'
                    >
                      <IconArrowRight className='mr-2 text-muted-foreground' />
                      {message}
                    </Button>
                  ),
                )}
                  {chatQuery.data?.suggest[0]?.suggests?.map((message, index) => (
                  <Button
                    key={'dd' + index}
                    variant='outline'
                    className='h-auto py-1 px-3 text-base text-justify flex'
                    /* eslint-disable */
                    onClick={()=> copyText(message)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-24 h-24 mr-2 text-slate-600'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z'
                      />
                    </svg>

                    {message}
                  </Button>
                ))}
              </div>
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
        append={message => {
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
