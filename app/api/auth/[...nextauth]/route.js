import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { settingsService } from "@/lib/settingsService"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const settings = await settingsService.getSettings();
                const adminEmail = settings?.general?.adminEmail || 'admin@rkb-amb.org';
                // Default password if empty: 'admin123'
                const adminPassword = settings?.general?.adminPassword || 'admin123';

                if (credentials.username === adminEmail && credentials.password === adminPassword) {
                    return { id: "1", name: "Admin", email: adminEmail, role: 'admin' }
                }
                return null
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || 'very-secret-key-change-me',
})

export { handler as GET, handler as POST }
