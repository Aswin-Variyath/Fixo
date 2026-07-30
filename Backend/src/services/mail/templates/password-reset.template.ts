import { ENV } from "../../../config/env.config";

export function passwordResetTemplate(
  firstName: string,
  resetToken: string,
): string {
  const resetLink = `${ENV.MAIL.FRONTEND_URL}/reset-password?token=${resetToken}`;
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Password</title>
</head>

<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">

<div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:8px;">

<h2>Password Reset Request</h2>

<p>Hello <strong>${firstName}</strong>,</p>

<p>
We received a request to reset your password.
Click the button below to create a new password.
</p>

<p style="margin:30px 0;">
<a
href="${resetLink}"
style="
background:#2563eb;
color:white;
padding:12px 24px;
text-decoration:none;
border-radius:6px;
display:inline-block;
">
Reset Password
</a>
</p>

<p>
This link will expire in <strong>15 minutes</strong>.
</p>

<p>
If you didn't request this password reset, you can safely ignore this email.
</p>

<hr>

<p style="font-size:12px;color:#666;">
If the button doesn't work, copy and paste this link into your browser:
</p>

<p style="font-size:12px;">
${resetLink}
</p>

</div>

</body>
</html>
    `;
}
