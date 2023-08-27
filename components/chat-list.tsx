
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ChatMessage } from '@/components/chat-message'
import { Message } from './chat'

export interface ChatList {
  messages: Message[]
  ModalClose: boolean
  setModalClose: (value: boolean) => void
}

export function ChatList({ messages, ModalClose, setModalClose }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <>
      <div className="relative mx-auto max-w-2xl px-4">
        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage message={message} />
            {index < messages.length - 1 && (
              <Separator className="my-4 md:my-8" />
            )}
          </div>
        ))}
        {ModalClose && (
          <div className="flex items-center justify-end  md:-right-10 md:-top-2 ">
            <Button
              variant="outline"
              onClick={() => setModalClose(false)}
              className="bg-background"
            >
              Sugerencias
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
