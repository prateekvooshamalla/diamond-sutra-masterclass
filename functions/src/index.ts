import {onCall, HttpsError} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";
import {defineSecret} from "firebase-functions/params";
import {sendEmail} from "./email/sendEmail";
import {initializeApp} from "firebase-admin/app";

initializeApp();
setGlobalOptions({region: "us-central1"});

const awsKeyId = defineSecret("AWS_ACCESS_KEY_ID");
const awsSecret = defineSecret("AWS_SECRET_ACCESS_KEY");
const awsRegion = defineSecret("AWS_REGION");
const sesFromEmail = defineSecret("SES_FROM_EMAIL");
const sesFromName = defineSecret("SES_FROM_NAME");

const secretsConfig = {
  secrets: [awsKeyId, awsSecret, awsRegion, sesFromEmail, sesFromName],
};

// ─── Welcome email — called on registration ───────────────────
export const sendWelcomeEmail = onCall(secretsConfig, async (req) => {
  const {email, name} = req.data;

  if (!email || !name) {
    throw new HttpsError("invalid-argument", "email and name are required.");
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:40px 20px;">
          <table width="560" cellpadding="0" cellspacing="0"
                 style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#4F46E5;padding:32px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:24px;">
                  Welcome to Diamond Sutra 🎉
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 32px;">
                <h2 style="color:#111827;margin:0 0 16px;">
                  Hi ${name}, great to have you!
                </h2>
                <p style="color:#6B7280;line-height:1.6;margin:0 0 24px;">
                  Your account has been created successfully.
                  You can now browse and enroll in our courses.
                </p>
                <p style="color:#6B7280;line-height:1.6;margin:0 0 32px;">
                  Please verify your email address using the
                  verification link we just sent you.
                </p>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:8px;background:#4F46E5;">
                      <a href="https://yourdomain.com/dashboard"
                         style="display:inline-block;padding:14px 32px;
                                color:#ffffff;font-weight:600;
                                text-decoration:none;font-size:15px;">
                        Go to Dashboard
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;border-top:1px solid #F3F4F6;">
                <p style="color:#9CA3AF;font-size:12px;margin:0;text-align:center;">
                  Diamond Sutra · If you did not create this account, ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail(email, `Welcome to Diamond Sutra, ${name}!`, html);
  return {success: true};
});