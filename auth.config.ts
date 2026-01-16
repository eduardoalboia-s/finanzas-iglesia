import type { NextAuthConfig } from 'next-auth'
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      
      const protectedPaths = ['/dashboard', '/members', '/finance', '/reports', '/settings']
      const isProtectedPath = protectedPaths.some(path => nextUrl.pathname.startsWith(path))

      if (isProtectedPath) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Redirect authenticated users to dashboard if they visit login, register or home page
        if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register') {
           return Response.redirect(new URL('/dashboard', nextUrl))
        }
      }
      return true
    },
    // Añadir rol y tenantId a la sesión
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        session.user.role = token.role as string
      }
      if (token.tenantId && session.user) {
        session.user.tenantId = token.tenantId as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.tenantId = user.tenantId
      }
      return token
    }
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
