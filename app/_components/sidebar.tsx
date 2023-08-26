'use client'

import { ThemeToggle } from '@/components/theme-toggle'

export const Sidebar = () => {
  return (
    <div className="w-72 inset-y-0 left-0 z-50 h-full border-r bg-background p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-start sm:space-x-2">
        <h1>Tickets History</h1>
      </div>
      <div></div>
      <ThemeToggle />
    </div>
  )
}
