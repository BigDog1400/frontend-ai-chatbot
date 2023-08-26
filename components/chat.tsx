'use client';

import { useChat, type Message } from 'ai/react';

import { cn } from '@/lib/utils';
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
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'react-hot-toast';
import { TextHint } from './text-hint';
import clsx from 'clsx';
import { XIcon } from './ui/icons';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null,
  );
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const [ModalClose, setModalClose] = useState(false);
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
          <div
            className={`rounded-lg border bg-background p-8 ${
              true ? 'border-blue-500' : 'border-gray-300'
            } cursor-pointer`}
          >
            <div className='font-bold text-2xl'>OpenAI Chatbot</div>
            <div className='text-sm text-gray-400'>
              AI chatbot using GPTdds-3
            </div>
          </div>
          <div className='rounded-lg border bg-background p-8'>
            <div className='font-bold text-2xl'>OpenAI Chatbot</div>
            <div className='text-sm text-gray-400'>AI chatbot using GPTs-3</div>
          </div>
          <div className='rounded-lg border bg-background p-8'>
            <div className='font-bold text-2xl'>OpenAI Chatbot</div>
            <div className='text-sm text-gray-400'>AI chatbot using GPTs-3</div>
          </div>
        </div>
      </aside>

      <div
        className={cn('pb-[200px] pt-4 md:pt-10 mx-auto w-full max-w-4xl', className)}
      >
        {messages.length ? (
          <>
            <ChatList
              messages={messages}
              ModalClose={ModalClose}
              setModalClose={setModalClose}
            />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>

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
