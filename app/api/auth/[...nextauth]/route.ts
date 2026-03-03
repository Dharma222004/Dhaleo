import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: "/", // We use our root page as the sign-in page
    },
    callbacks: {
        async session({ session, token }) {
            return session
        },
    },
})

export { handler as GET, handler as POST }
