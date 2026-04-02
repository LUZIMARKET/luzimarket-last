"use server";

import { Resend } from "resend";
import WelcomeSubscriberEmail from "@/emails/welcome-subscriber";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email")?.toString();

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    // 1. Add them to Resend Contacts (Audience Database)
    // process.env.RESEND_AUDIENCE_ID is required to track them in Resend
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        audienceId: process.env.RESEND_AUDIENCE_ID,
        email: email,
        unsubscribed: false,
      });
    }

    // 2. Send the Welcome Email with the 10% discount code
    const { data, error } = await resend.emails.send({
      from: "LUZI MARKET <hello@luzimarket.com>", // Update with your verified domain
      to: email,
      subject: "¡Tu código de 10% de descuento!",
      react: WelcomeSubscriberEmail({ email }),
    });

    if (error) {
      console.error("Resend send error:", error);
      return { error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Newsletter subscription error:", err);
    return { error: "Failed to subscribe. Please try again." };
  }
}
