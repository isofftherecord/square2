"use server";

import { sendSiteEmail } from "@/lib/mail";

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(formData: FormData, key: string, max: number) {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isHoneypotFilled(formData: FormData) {
  return readString(formData, "website", 200).length > 0;
}

function userError(message: string): FormState {
  return { status: "error", message };
}

function sendError(): FormState {
  if (process.env.NODE_ENV === "development") {
    return {
      status: "error",
      message: "Add RESEND_API_KEY to .env.local to send mail.",
    };
  }

  return {
    status: "error",
    message: "Something went wrong. Please try again.",
  };
}

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (isHoneypotFilled(formData)) {
    return { status: "success", message: "Message sent. We will be in touch." };
  }

  const name = readString(formData, "name", 200);
  const company = readString(formData, "company", 200);
  const email = readString(formData, "email", 320);
  const phone = readString(formData, "phone", 50);
  const message = readString(formData, "message", 5000);
  const interests = formData
    .getAll("interest")
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  if (!name) return userError("Please add your name.");
  if (!EMAIL_PATTERN.test(email)) return userError("Please add a valid email.");
  if (!message) return userError("Please add a message.");

  const interestLabel = interests.length > 0 ? interests.join(", ") : "unspecified";

  try {
    await sendSiteEmail({
      subject: `Contact: ${interestLabel} — ${name}`,
      replyTo: email,
      text: [
        `Interest: ${interestLabel}`,
        `Name: ${name}`,
        `Company: ${company || "—"}`,
        `Email: ${email}`,
        `Phone: ${phone || "—"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });
  } catch (error) {
    console.error("submitContact", error);
    return sendError();
  }

  return { status: "success", message: "Message sent. We will be in touch." };
}

export async function subscribe(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (isHoneypotFilled(formData)) {
    return { status: "success", message: "Subscribed." };
  }

  const email = readString(formData, "email", 320);
  if (!EMAIL_PATTERN.test(email)) {
    return userError("Please add a valid email.");
  }

  try {
    await sendSiteEmail({
      subject: `Subscribe: ${email}`,
      replyTo: email,
      text: `New subscribe request\n\nEmail: ${email}`,
    });
  } catch (error) {
    console.error("subscribe", error);
    return sendError();
  }

  return { status: "success", message: "Subscribed." };
}
