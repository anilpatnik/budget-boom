import { constants } from "@/utils";
import { ServiceType } from "@/utils/enums";
import { openApi, authApi, fbService } from "@/services";

export async function signInWithGoogle() {
  try {
    const provider = new fbService.GoogleAuthProvider();
    const fbUser = await fbService.signInWithPopup(fbService.firebaseAuth, provider);
    if (fbUser?.user?.uid?.length === 0) throw new Error("SignUp Failed!");
    if (fbUser) return await getUser();
    return { success: false, resource: fbUser };
  } catch (error) {
    const err = fbService.ErrorMessage(error as fbService.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function getUser() {
  await fbService.refreshToken(false);
  const response = await authApi.post(ServiceType.SignIn);
  const { success, resource } = response.data;
  return { success, resource };
}

export async function updateProfilePic(photoURL: string) {
  try {
    const user = fbService.firebaseAuth.currentUser;
    if (user?.uid) await fbService.updateProfile(user, { photoURL });
    return { success: true, resource: constants.SUCCESS };
  } catch (error) {
    const err = fbService.ErrorMessage(error as fbService.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function updateProfileInfo(name: string, countryId?: string) {
  try {
    const response = await authApi.post(ServiceType.Profile, { name, countryId });
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
}

export async function deleteProfileAsync() {
  try {
    const response = await authApi.delete(ServiceType.Profile);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
}

export async function captchaVerify(token: string) {
  try {
    const response = await openApi.post(ServiceType.Captcha, { token });
    const { success, hostname } = response.data;
    return { success, resource: hostname };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
}

// Deprecated: Email/password authentication is no longer supported
// These functions are kept for backward compatibility but should not be used
export async function createUserWithEmail(name: string, email: string, password: string) {
  return { success: false, resource: "Email/password authentication is not supported. Use Google sign-in instead." };
}

export async function signInWithEmail(email: string, password: string) {
  return { success: false, resource: "Email/password authentication is not supported. Use Google sign-in instead." };
}

export async function verifySignInEmail(actionCode: string) {
  return false;
}

export async function resendVerifySignInEmail() {
  return false;
}

export async function sendForgotPasswordUrl(email: string) {
  return false;
}

export async function verifyForgotPasswordUrl(actionCode: string) {
  return { success: false, resource: "Password reset is not supported. Use Google sign-in instead." };
}

export async function updateForgotPassword(actionCode: string, newPassword: string) {
  return false;
}

export async function updateProfilePassword(newPassword: string) {
  return { success: false, resource: "Password management is not supported. Use Google sign-in instead." };
}
