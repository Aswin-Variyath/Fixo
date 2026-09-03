export const adminOtpTemplate = (
    firstName: string,
    otp: string
): string => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Admin Login Verification</title>
        </head>

        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 30px;">

            <div style="
                max-width: 500px;
                margin: auto;
                background: white;
                padding: 30px;
                border-radius: 12px;
            ">

                <h2>Admin Login Verification</h2>

                <p>Hello ${firstName},</p>

                <p>
                    We received a request to sign in to your admin account.
                </p>

                <p>
                    Your verification code is:
                </p>

                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    text-align: center;
                    padding: 20px;
                    background: #f3f3f3;
                    border-radius: 8px;
                ">
                    ${otp}
                </div>

                <p>
                    This OTP is valid for 5 minutes.
                </p>

                <p>
                    If you did not attempt to sign in, please secure your account.
                </p>

                <p>
                    Regards,<br>
                    Local Worker Platform
                </p>

            </div>

        </body>
        </html>
    `;
};