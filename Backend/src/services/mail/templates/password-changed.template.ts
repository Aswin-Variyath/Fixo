export function passwordChangedTemplate(firstName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Changed</title>
</head>

<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">

<div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:8px;">

<h2>Password Changed Successfully</h2>

<p>Hello <strong>${firstName}</strong>,</p>

<p>
Your account password has been changed successfully.
</p>

<p>
If you made this change, no further action is required.
</p>

<p style="color:#dc2626;">
If you did <strong>not</strong> change your password, please contact support immediately because your account may have been compromised.
</p>

<hr>

<p style="font-size:12px;color:#666;">
Local Worker Team
</p>

</div>

</body>
</html>
`;
}