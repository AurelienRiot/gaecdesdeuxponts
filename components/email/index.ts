import { transporter } from "@/lib/nodemailer";
import WelcomeEmail from "./welcome";
import { render } from "@react-email/render";

const baseUrl = process.env.NEXT_PUBLIC_URL;

export async function sendOTP(otp: string, identifier: string, connectionLink: string) {
  await transporter.sendMail({
    from: "laiteriedupontrobert@gmail.com",
    to: identifier,
    subject: `Connexion à votre compte. Voici votre code unique : ${otp} - Laiterie du Pont Robert`,
    text: `Bienvenue sur la Laiterie du Pont Robert. Voici votre code unique : ${otp}`,
    html: await render(WelcomeEmail({ otp, baseUrl, connectionLink })),
  });
}
