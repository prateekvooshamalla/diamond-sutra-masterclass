import * as dotenv from "dotenv";
dotenv.config();

import {SESClient, SendEmailCommand} from "@aws-sdk/client-ses";

function getSESClient() {
  return new SESClient({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const text = html.replace(/<[^>]+>/g, "").trim();

  const command = new SendEmailCommand({
    Source: `${process.env.SES_FROM_NAME} <${process.env.SES_FROM_EMAIL}>`,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {Data: subject, Charset: "UTF-8"},
      Body: {
        Html: {Data: html, Charset: "UTF-8"},
        Text: {Data: text, Charset: "UTF-8"},
      },
    },
  });

  return getSESClient().send(command);
}
