import { Resend } from "resend";

type SendSiteEmailInput = {
  subject: string;
  text: string;
  replyTo?: string;
};

// Destino de Contact y Subscribe. En pruebas: katheryn@madeotr.com.
function getToAddress() {
  return process.env.CONTACT_TO_EMAIL?.trim() || "katheryn@madeotr.com";
}

function getFromAddress() {
  return (
    process.env.CONTACT_FROM_EMAIL?.trim() || "Square2 <beth.t@example.com>"
  );
}

export async function sendSiteEmail({
  subject,
  text,
  replyTo,
}: SendSiteEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("missing_api_key");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: getToAddress(),
    subject,
    text,
    replyTo,
  });

  if (error) {
    throw new Error(error.message);
  }
}
