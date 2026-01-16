import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    tenantId?: string | null
  }
  
  interface Session {
    user: User & {
      role?: string
      tenantId?: string | null
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string
    tenantId?: string | null
  }
}
