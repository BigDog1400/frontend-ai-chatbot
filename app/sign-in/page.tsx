import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const session = await auth()
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="absolute top-0 left-40 right-0 bottom-0 flex items-center justify-center py-10">
    <LoginButton />
  </div>
  )
}
