import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { auth } from '@/auth';
import { clearChats } from '@/app/actions';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar';
import { SidebarList } from '@/components/sidebar-list';
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel,
} from '@/components/ui/icons';
import { SidebarFooter } from '@/components/sidebar-footer';
import { ThemeToggle } from '@/components/theme-toggle';
import { ClearHistory } from '@/components/clear-history';
import { UserMenu } from '@/components/user-menu';
import { LoginButton } from '@/components/login-button';

export async function Header() {
  const session = await auth();
  return (

     <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
     <div className="flex items-center">
       <div className="flex items-center">
         {session?.user ? (
           <UserMenu user={session.user} />
         ) : (
           <Button variant="link" asChild className="-ml-2">
             <Link href="/sign-in?callbackUrl=/">ChatBot</Link>
           </Button>
         )}
       </div>
     </div>
     <div className="flex items-center justify-end space-x-2">
  
       <svg
          stroke='currentColor'
          fill='currentColor'
          strokeWidth={0}
          viewBox='0 0 24 24'
          className='w-10 h-10'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M21.598 11.064a1.006 1.006 0 0 0-.854-.172A2.938 2.938 0 0 1 20 11c-1.654 0-3-1.346-3.003-2.938.005-.034.016-.134.017-.168a.998.998 0 0 0-1.254-1.006A3.002 3.002 0 0 1 15 7c-1.654 0-3-1.346-3-3 0-.217.031-.444.099-.716a1 1 0 0 0-1.067-1.236A9.956 9.956 0 0 0 2 12c0 5.514 4.486 10 10 10s10-4.486 10-10c0-.049-.003-.097-.007-.16a1.004 1.004 0 0 0-.395-.776zM8.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-2 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.5-6.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm3.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z' />
        </svg>
     </div>
   </header>
  );
}
