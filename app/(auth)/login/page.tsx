import LoginForm from '@/components/auth/login-form'
 
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center md:h-screen bg-gray-50">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32 bg-white rounded-lg shadow-lg">
        <LoginForm />
      </div>
    </div>
  )
}
