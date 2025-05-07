import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { env } from "~/env";
import PasswordResetEmail from "./components/password-reset"

// Ignore self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const transporter = nodemailer.createTransport({
    host: env.EMAIL_SERVER,
    port: parseInt(env.EMAIL_PORT),
    secure: env.EMAIL_PORT === "465",
    auth: {
        user: env.EMAIL_USERNAME,
        pass: env.EMAIL_PASSWORD,
    },
});

export const sendPasswordResetEmail = async (
    user: { name: string; email: string },
    resetLink: string,
) => {
    const htmlContent = await render(<PasswordResetEmail user={user} resetLink={resetLink} />);

    await transporter.sendMail({
        from: `"QuoteLearner" <${env.EMAIL_USERNAME}>`,
        to: user.email,
        subject: "Password Reset request",
        html: htmlContent,
    });

    return { success: true };
};

