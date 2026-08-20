"use client";

// Default Master Passcode for initial setup
export const DEFAULT_ADMIN_PIN = "202688";
const PIN_STORAGE_KEY = "carepay_admin_master_pin";
const AUTH_SESSION_KEY = "carepay_admin_authenticated";
const LOCK_TIMEOUT_KEY = "carepay_admin_lock_timeout";

export interface AdminSecuritySettings {
  pin: string;
  autoLockMinutes: number;
}

export function getAdminPin(): string {
  if (typeof window === "undefined") return DEFAULT_ADMIN_PIN;
  return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_ADMIN_PIN;
}

export function setAdminPin(newPin: string): boolean {
  if (typeof window === "undefined") return false;
  if (!newPin || newPin.length !== 6) return false;
  localStorage.setItem(PIN_STORAGE_KEY, newPin);
  return true;
}

export function verifyAdminPin(enteredPin: string): boolean {
  const current = getAdminPin();
  return enteredPin === current;
}

export function isAdminUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  const authTime = sessionStorage.getItem(AUTH_SESSION_KEY);
  if (!authTime) return false;
  
  const timeoutMin = parseInt(localStorage.getItem(LOCK_TIMEOUT_KEY) || "15", 10);
  const diffMs = Date.now() - parseInt(authTime, 10);
  const maxMs = timeoutMin * 60 * 1000;
  
  if (diffMs > maxMs) {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    return false;
  }
  return true;
}

export function setAdminUnlocked(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_SESSION_KEY, Date.now().toString());
}

export function lockAdmin(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}

// WebAuthn Hardware Biometrics (Windows Hello, Touch ID, Face ID, Android Biometrics)
export async function authenticateWithWebAuthn(): Promise<{ success: boolean; message: string }> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    return { success: false, message: "WebAuthn Biometrics is not supported on this browser." };
  }

  try {
    const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!isAvailable) {
      return { success: false, message: "Hardware biometric sensor not available on this device." };
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    // Prompt platform authenticator (TouchID / Windows Hello / FaceID)
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "required",
        rpId: window.location.hostname || "localhost",
      },
    });

    if (credential) {
      setAdminUnlocked();
      return { success: true, message: "Biometric authentication successful!" };
    }
    return { success: false, message: "Biometric authentication was cancelled." };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Biometric authentication failed";
    return { success: false, message: errorMsg };
  }
}
