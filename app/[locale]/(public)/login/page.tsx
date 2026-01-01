"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { useRouter as useNextRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

const createLoginSchema = (t: any) => z.object({
  email: z.string().email(t("validation.invalidEmail")),
  password: z.string().min(6, t("validation.passwordMinLength")),
});

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const nextRouter = useNextRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("LoginPage");
  const tAuth = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loginSchema = createLoginSchema(t);

  useEffect(() => {
    // Check for verification success
    if (searchParams.get("verified") === "true") {
      setSuccessMessage(t("emailVerifiedSuccess"));
    }

    // Check for error messages
    const errorParam = searchParams.get("error");
    if (errorParam === "invalid-token") {
      setError(t("errors.invalidToken"));
    } else if (errorParam === "expired-token") {
      setError(t("errors.expiredToken"));
    } else if (errorParam === "verification-failed") {
      setError(t("errors.verificationFailed"));
    }
  }, [searchParams, t]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // First, try to authenticate to get detailed error info and detect role
      const { authenticateUser } = await import("@/lib/actions/auth");
      const authResult = await authenticateUser(data.email, data.password, undefined, locale);

      if (!authResult.success) {
        if (authResult.isLocked) {
          setError(authResult.error || tAuth("accountLocked", { minutes: 30 }));
        } else if (authResult.remainingAttempts !== undefined && authResult.remainingAttempts < 3) {
          setError(tAuth("remainingAttempts", { attempts: authResult.remainingAttempts }));
        } else {
          setError(authResult.error || tAuth("invalidCredentials"));
        }
        return;
      }

      // If authentication succeeded, proceed with NextAuth signIn
      // We pass the detected userType if available, or undefined
      const detectedRole = authResult.user?.role;

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        userType: detectedRole, // Pass the detected role so NextAuth can verify it
        redirect: false,
      });

      if (result?.error) {
        setError(tAuth("loginError"));
      } else {
        // Redirect based on user type
        switch (detectedRole) {
          case "admin":
            router.push("/admin"); // Admin dashboard
            break;
          case "vendor":
            router.push("/vendor/dashboard"); // Vendor dashboard
            break;
          default:
            router.push("/"); // Customer home
        }
      }
    } catch (error) {
      setError(tAuth("loginError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-times-now">LUZIMARKET</h1>
          <p className="mt-2 text-sm text-gray-600 font-univers">
            {t("subtitle")}
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 font-univers">{successMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("fields.email")}</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              disabled={isLoading}
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 mt-1" role="alert">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">{t("fields.password")}</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              disabled={isLoading}
              className="mt-1"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500 mt-1" role="alert">{form.formState.errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className={`p-3 rounded-md text-sm ${error.includes("bloqueada") || error.includes("intentos restantes")
              ? "bg-red-50 border border-red-200 text-red-700"
              : "text-red-500"
              }`} role="alert">
              {error}
              {error.includes("verifica tu correo electrónico") && (
                <div className="mt-2">
                  <Link href="/resend-verification" className="text-sm text-blue-600 hover:text-blue-800 underline">
                    {t("resendVerificationLink")}
                  </Link>
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("loggingIn")}
              </>
            ) : (
              t("loginButton")
            )}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-gray-500 font-univers">
                {t("social.or")}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-univers"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              {t("social.google")}
            </Button>

            {/* Facebook */}
            <Button
              type="button"
              className="w-full bg-[#1877F2] text-white hover:bg-[#1864cc] font-univers border-none"
              onClick={() => signIn("facebook", { callbackUrl: "/" })}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
              </svg>
              {t("social.facebook")}
            </Button>

            {/* Apple */}
            <Button
              type="button"
              className="w-full bg-black text-white hover:bg-gray-800 font-univers"
              onClick={() => signIn("apple", { callbackUrl: "/" })}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C55 141.6 4 216 4 300.7c0 74.2 46.5 174.5 90.4 238.1 19.6 28.3 49.3 64.9 76.8 63.8 28.5-1.1 40-19.7 78.4-19.7 37 0 49.1 19.8 77.2 18.6 29.5-1.2 56.6-35.1 76.5-63.5-56-31.3-64.6-88.4-64.6-99.3zm-67.6-189.9c15.1-18.8 24.6-43.1 22.1-66.8-22.3 1.9-49 14.8-64.6 33.1-13.7 15.9-25.5 41.5-22.1 65.6 23.4 1.7 49-13.5 64.6-31.9z"></path>
              </svg>
              {t("social.apple")}
            </Button>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-black font-univers">
                {t("forgotPassword")}
              </Link>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 font-univers">
                {t("noAccountQuestion")}{" "}
                <Link href="/register" className="font-medium text-black hover:underline ml-1">
                  {t("signUp")}
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div >
    </div >
  );
}