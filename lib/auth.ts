// Runtime configuration for Next.js
export const runtime = 'nodejs';

import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users, vendors, adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createSession } from "@/lib/actions/session";

// Custom error class for invalid credentials
class InvalidLoginError extends CredentialsSignin {
  code = "Invalid credentials"
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  userType: z.enum(["customer", "vendor", "admin"]).optional(),
});

import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Apple from "next-auth/providers/apple";

export const authOptions = {
  // Credentials provider requires JWT sessions - cannot use database adapter with credentials
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Add trustHost for test environment and localhost
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID,
      clientSecret: process.env.AUTH_APPLE_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials, req) {
        try {
          console.log("Authorize called with credentials:", credentials);
          console.log("Request:", req ? "Present" : "Not present");

          if (!credentials) {
            console.error("No credentials provided");
            throw new InvalidLoginError();
          }

          // NextAuth always passes credentials as an object, not a string
          // Validate credentials with Zod schema
          const validationResult = loginSchema.safeParse(credentials);
          if (!validationResult.success) {
            console.error("Credential validation failed:", validationResult.error);
            throw new InvalidLoginError();
          }

          const { email, password, userType } = validationResult.data;

          // Import the authenticateUser function dynamically to avoid circular dependencies
          const { authenticateUser } = await import("@/lib/actions/auth");

          const result = await authenticateUser(email, password, userType);

          if (!result.success) {
            // Throw custom error for better error handling
            console.error("Authentication failed:", result.error);
            throw new InvalidLoginError();
          }

          return result.user || null;
        } catch (error) {
          console.error("Auth error:", error);

          if (error instanceof InvalidLoginError) {
            throw error;
          }
          // For other errors, throw invalid login
          throw new InvalidLoginError();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }: { token: any; user: any; account?: any; trigger?: string }) {
      // Initial sign in
      if (user) {
        // If it's an OAuth login (account is present and type is oauth)
        if (account && account.type === "oauth") {
          const email = user.email;

          if (email) {
            try {
              // Check if user exists in DB
              const [existingUser] = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

              if (existingUser) {
                token.id = existingUser.id;
                token.role = "customer"; // OAuth users are customers by default
              } else {
                // Create new user
                const [newUser] = await db
                  .insert(users)
                  .values({
                    email: email,
                    name: user.name || "User",
                    isActive: true,
                    emailVerified: true, // OAuth emails are verified
                    emailVerifiedAt: new Date(),
                  })
                  .returning();

                token.id = newUser.id;
                token.role = "customer";
              }
            } catch (error) {
              console.error("Error handling OAuth user:", error);
              // Fallback to basic info if DB fails, but this might cause issues downstream
              token.id = user.id;
              token.role = "customer";
            }
          }
        } else {
          // Credentials login
          token.id = user.id;
          token.role = user.role as "customer" | "vendor" | "admin";
        }

        // Generate a unique session token for tracking only on sign in
        if (trigger === "signIn" || trigger === "signUp") {
          token.sessionToken = `${token.id}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
          // Create a database session
          await createSession(token.id, token.role, token.sessionToken);
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.sessionToken = token.sessionToken;

        // If user is a vendor, fetch vendor details
        if (token.role === "vendor") {
          try {
            const [vendor] = await db
              .select()
              .from(vendors)
              .where(eq(vendors.id, token.id))
              .limit(1);

            if (vendor) {
              session.user.vendor = {
                id: vendor.id,
                businessName: vendor.businessName,
                contactName: vendor.contactName,
                email: vendor.email,
                isActive: vendor.isActive,
              };
            }
          } catch (error) {
            console.error("Error fetching vendor details:", error);
          }
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);