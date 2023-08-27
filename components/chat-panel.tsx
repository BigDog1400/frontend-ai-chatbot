import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { IconArrowRight } from '@/components/ui/icons'
import { Dispatch, SetStateAction } from 'react'


export interface ChatPanelProps {
  isLoading: boolean
  append: (value: string) => void
  input: string
  setInput: Dispatch<SetStateAction<string>>
}

export function ChatPanel({
  isLoading,
  append,
  input,
  setInput,
}: ChatPanelProps) {
  return (
    <div className="fixed left-[660px] inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      
      {/*
            <ButtonScrollToBottom />
      */}

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
      
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={ value => {
               append(value)
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
