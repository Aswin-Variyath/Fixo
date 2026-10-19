export const KYC_WIZARD_STEPS = [
    "SELFIE",
    "AADHAAR",
    "BANK_DETAILS",
    "QUALIFICATIONS",
    "EXPERIENCE",
    "REVIEW",
] as const;

export type KycWizardStep = (typeof KYC_WIZARD_STEPS)[number];