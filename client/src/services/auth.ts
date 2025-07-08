import { ErrorMessage, ServiceType, constants, fb } from "@/util";
import { authApi, openApi } from "@/services";

export async function createUserWithEmail(name: string, email: string, password: string) {
  try {
    const fbUser = await fb.createUserWithEmailAndPassword(fb.fAuth, email, password);
    if (fbUser?.user?.uid?.length === 0) throw new Error("SignUp Failed!");
    await fb.updateProfile(fbUser.user, { displayName: name });
    await fb.sendEmailVerification(fbUser.user);
    return { success: true, resource: fbUser.user.uid };
  } catch (error) {
    const err = ErrorMessage(error as fb.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const fbUser = await fb.signInWithEmailAndPassword(fb.fAuth, email, password);
    if (fbUser?.user?.uid?.length === 0 || !fbUser?.user?.emailVerified)
      throw new Error("SignIn Failed!");
    if (fbUser) return await getUser(fbUser);
    return { success: false, resource: fbUser };
  } catch (error) {
    const err = ErrorMessage(error as fb.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new fb.GoogleAuthProvider();
    const fbUser = await fb.signInWithPopup(fb.fAuth, provider);
    if (fbUser?.user?.uid?.length === 0) throw new Error("SignUp Failed!");
    if (fbUser) return await getUser(fbUser);
    return { success: false, resource: fbUser };
  } catch (error) {
    const err = ErrorMessage(error as fb.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function getUser(fbUser: fb.UserCredential) {
  // const zone = new Date().getTimezoneOffset().toString();
  const response = await openApi.post(ServiceType.SignIn, fbUser.user);
  const { success, resource } = response.data;
  return { success, resource };
}

export async function verifySignInEmail(actionCode: string) {
  try {
    await fb.applyActionCode(fb.fAuth, actionCode);
    return true;
  } catch (error) {
    // console.log("Verify SignIn Email", error);
    return false;
  }
}

export async function resendVerifySignInEmail() {
  try {
    const user = fb.fAuth.currentUser;
    if (user?.uid) fb.sendEmailVerification(user);
    return true;
  } catch (error) {
    // console.log("Resend Verify SignIn Email", error);
    return false;
  }
}

export async function sendForgotPasswordUrl(email: string) {
  try {
    await fb.sendPasswordResetEmail(fb.fAuth, email);
    return true;
  } catch (error) {
    // console.log("Send Forgot Reset Email", error);
    return false;
  }
}

export async function verifyForgotPasswordUrl(actionCode: string) {
  try {
    const response = await fb.verifyPasswordResetCode(fb.fAuth, actionCode);
    return { success: true, resource: response };
  } catch (error) {
    const err = ErrorMessage(error as fb.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function updateForgotPassword(actionCode: string, newPassword: string) {
  try {
    await fb.confirmPasswordReset(fb.fAuth, actionCode, newPassword);
    return true;
  } catch (error) {
    // console.log("Update Forgot Password", error);
    return false;
  }
}

export async function updateProfilePassword(newPassword: string) {
  try {
    const user = fb.fAuth.currentUser;
    if (user?.uid) await fb.updatePassword(user, newPassword);
    return { success: true, resource: constants.SUCCESS };
  } catch (error) {
    const err = ErrorMessage(error as fb.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function updateProfilePic(photoURL: string) {
  try {
    const user = fb.fAuth.currentUser;
    if (user?.uid) await fb.updateProfile(user, { photoURL });
    return { success: true, resource: constants.SUCCESS };
  } catch (error) {
    const err = ErrorMessage(error as fb.FirebaseError | Error);
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
