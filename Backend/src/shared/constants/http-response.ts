export const HttpResponse = {
  COMMON: {
    SUCCESS: "Success",
    CREATED: "Resource created successfully",
    UPDATED: "Resource updated successfully",
    DELETED: "Resource deleted successfully",
    NOT_FOUND: "Resource not found",
    INTERNAL_SERVER_ERROR: "Internal server error",
    VALIDATION_FAILED: "Validation failed",
  },

  AUTH: {
    SIGNUP_SUCCESS: "Account created successfully",
    LOGIN_SUCCESS: "Logged in successfully",
    LOGOUT_SUCCESS: "Logged out successfully",

    INVALID_CREDENTIALS: "Invalid email or password",
    ACCOUNT_DISABLED: "Account access is not allowed",

    UNAUTHORIZED: "Authentication required",
    INVALID_SESSION: "Invalid or expired authentication session",

    EMAIL_VERIFIED: "Email verified successfully",
    EMAIL_ALREADY_VERIFIED: "Email is already verified",

    PASSWORD_RESET_EMAIL_SENT: "Password reset link sent successfully",
    PASSWORD_RESET_SUCCESS: "Password reset successfully",
    INVALID_RESET_TOKEN: "Invalid or expired reset token",

    EMAIL_ALREADY_EXISTS: "Email is already registered",
    PHONE_ALREADY_EXISTS: "Phone number is already registered",
    TOKEN_REFRESH_SUCCESS: "Token refreshed successfully",

    CURRENT_USER: "Current user retrieved successfully"
  },

  USER: {
    PROFILE_UPDATED: "Profile updated successfully",
    USER_NOT_FOUND: "User not found",
    CURRENT_USER: "Current user retrieved successfully"
  },

  MAIL: {
    VERIFICATION_EMAIL_SENT: "Verification email sent successfully",
    EMAIL_SEND_FAILED: "Failed to send email",
  },

  CATEGORY: {
    LIST: "Categories retrieved successfully"
  }

} as const;