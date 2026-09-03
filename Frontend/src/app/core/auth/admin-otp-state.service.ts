import { Service } from "@angular/core";
import { AdminOtpSession } from "./auth.types";

@Service()
export class AdminOtpStateService {

  private readonly storageKey = 'admin-otp-session';

  setSession(challengeId: string,otpExpiresIn: number,resendAfter: number): void {
    const now = Date.now();

  const session: AdminOtpSession = {
    challengeId,
    otpExpiresAt: now + otpExpiresIn * 1000,
    resendAvailableAt: now + resendAfter * 1000
  };

  sessionStorage.setItem(
    this.storageKey,
    JSON.stringify(session)
  );

  console.log('OTP session saved:', session);
  }

  getSession(): AdminOtpSession | null {
    const value = sessionStorage.getItem(this.storageKey);

    if (!value) return null;

    try {
      return JSON.parse(value) as AdminOtpSession;
    } catch {
      this.clearSession();
      return null;
    }
  }

  getChallengeId(): string | null {
    return this.getSession()?.challengeId ?? null;
  }

  getOtpRemainingSeconds(): number {
    const session = this.getSession();

    if (!session) return 0;

    return Math.max(
      0,
      Math.ceil(
        (session.otpExpiresAt - Date.now()) / 1000
      )
    );
  }

  getResendRemainingSeconds(): number {
    const session = this.getSession();

    if (!session) return 0;

    return Math.max(
      0,
      Math.ceil(
        (session.resendAvailableAt - Date.now()) / 1000
      )
    );
  }

  clearSession(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  hasActiveSession(): boolean {
    return this.getOtpRemainingSeconds() > 0;
  }
  updateSession(challengeId:string, otpExpiresIn:number,resendAfter:number) {
    this.setSession(challengeId,otpExpiresIn,resendAfter)
  }
}