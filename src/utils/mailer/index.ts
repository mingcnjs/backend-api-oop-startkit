import { writeFile } from "fs/promises";
import nodemailer from "nodemailer";
import queryString from "query-string";
import config from "../../config";

interface Arguments extends Omit<nodemailer.SendMailOptions, "from"> {
  to: nodemailer.SendMailOptions["to"];
  subject: nodemailer.SendMailOptions["subject"];
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: config.email.fromAddress,
    serviceClient: config.email.clientId,
    // force new line characters, see: https://github.com/nodemailer/nodemailer/issues/1176#issuecomment-717837363
    privateKey: config.email.privateKey?.replace(/\\n/g, "\n"),
  },
});

export async function sendMail(args: Arguments) {
  if (
    !config.email.fromAddress ||
    !config.email.clientId ||
    !config.email.privateKey
  ) {
    const body = args.html || args.text;

    console.info(
      `Mocking email function due to missing variables. To: "${
        args.to
      }", Subject: "${args.subject}", Body: "${body || "N/A"}"`
    );

    typeof body === "string" &&
      (await writeFile(`${process.cwd()}/mock-email.html`, body));

    return;
  }

  await transporter.verify();
  await transporter.sendMail({
    ...args,
    from: config.email.fromAddress,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  passwordResetLink: string,
  baseURL: string
) {
  const {
    query: { oobCode },
  } = queryString.parseUrl(passwordResetLink);

  const url = `${baseURL}/reset-password?oobCode=${oobCode}`;

  await sendMail({
    to: email,
    subject: "Please confirm your password reset",
    html: url,
  });
}
