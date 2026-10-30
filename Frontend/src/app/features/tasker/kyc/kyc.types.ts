export type KycStepNumber = 1 | 2 | 3 | 4;

export interface KycStepMeta {
  number: KycStepNumber;
  title: string;
  subLabel: string;
  icon: string;
}

export type SelfieCameraState =
  | 'permission'
  | 'denied'
  | 'live'
  | 'captured'
  | 'confirmed';

export type BankFormState = 'empty' | 'uploaded' | 'validated' | 'mismatch';
