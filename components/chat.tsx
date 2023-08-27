'use client';

import { useChat, type Message } from 'ai/react';

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

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;

  /** new props for our example */
  chats: Chats
}

export function Chat({ id, initialMessages, className, chats }: ChatProps) {
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
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
    });

  const exampleMessages = [
    {
      heading: 'Explain technical concepts',
      message: `What is a "serverless function"?`,
    },
    {
      heading: 'Summarize an article',
      message: 'Summarize the following article for a 2nd grader: \n',
    },
    {
      heading: 'Draft an email',
      message: `Draft an email to my boss about the following: \n`,
    },
  ];
  return (
    <>
      <aside className='inset-y-0 left-72 w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 h-full'>
        <div className='col-span-1 flex gap-2 flex-col mx-auto mt-20'>
          {
            chats?.map(chat => (<div
              className={`rounded-lg border bg-background p-8 ${true ? 'border-blue-500' : 'border-gray-300'
                } cursor-pointer`}
            >
              <div className='font-bold text-2xl'>OpenAI Chatbot</div>
              <div className='text-sm text-gray-400'>
                AI chatbot using GPTdds-3
              </div>
            </div>))
          }
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
          messages={messages}
          ModalClose={ModalClose}
          setModalClose={setModalClose}
        />
        <div
          className={clsx('', {
            'lg:mt-[510px] mt-[320px]': messages.length === 0,
          })}
        >
          <div
            className={clsx('mx-auto max-w-2xl px-4 ', {
              hidden: ModalClose,
            })}
          >
            <div className='rounded-lg border bg-background p-8 relative'>
              {messages.length > 0 && (
                <button
                  onClick={() => setModalClose(true)}
                  type='button'
                  className='absolute top-4 right-4 w-6 h-6 cursor-pointer'
                >
                  <XIcon />
                </button>
              )}

              <h1 className='mb-2 text-lg font-semibold'>Sugerencias:</h1>

              <div className='mt-4 flex lg:flex-row flex-col items-start lg:space-x-2 lg:space-y-0 space-y-3'>
                {exampleMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant='secondary'
                    className='h-auto py-1 px-3 text-base'
                  >
                    {message.heading}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ChatScrollAnchor trackVisibility={isLoading} />
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
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
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
      </Dialog>
    </>
  );
}
