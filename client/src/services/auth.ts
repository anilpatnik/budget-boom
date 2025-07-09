import { constants } from "@/utils";
import { ServiceType } from "@/utils/enums";
import { openApi, authApi, fbService } from "@/services";

export async function createUserWithEmail(name: string, email: string, password: string) {
  try {
    const fbUser = await fbService.createUserWithEmailAndPassword(
      fbService.firebaseAuth,
      email,
      password
    );
    if (fbUser?.user?.uid?.length === 0) throw new Error("SignUp Failed!");
    await fbService.updateProfile(fbUser.user, { displayName: name });
    await fbService.sendEmailVerification(fbUser.user);
    return { success: true, resource: fbUser.user.uid };
  } catch (error) {
    const err = fbService.ErrorMessage(error as fbService.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const fbUser = await fbService.signInWithEmailAndPassword(
      fbService.firebaseAuth,
      email,
      password
    );
    if (fbUser?.user?.uid?.length === 0 || !fbUser?.user?.emailVerified)
      throw new Error("SignIn Failed!");
    if (fbUser) return await getUser(fbUser);
    return { success: false, resource: fbUser };
  } catch (error) {
    const err = fbService.ErrorMessage(error as fbService.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new fbService.GoogleAuthProvider();
    const fbUser = await fbService.signInWithPopup(fbService.firebaseAuth, provider);
    if (fbUser?.user?.uid?.length === 0) throw new Error("SignUp Failed!");
    if (fbUser) return await getUser(fbUser);
    return { success: false, resource: fbUser };
  } catch (error) {
    const err = fbService.ErrorMessage(error as fbService.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function getUser(fbUser: fbService.UserCredential) {
  // const zone = new Date().getTimezoneOffset().toString();
  const response = await openApi.post(ServiceType.SignIn, fbUser.user);
  const { success, resource } = response.data;
  return { success, resource };
}

export async function verifySignInEmail(actionCode: string) {
  try {
    await fbService.applyActionCode(fbService.firebaseAuth, actionCode);
    return true;
  } catch (error) {
    // console.log("Verify SignIn Email", error);
    return false;
  }
}

export async function resendVerifySignInEmail() {
  try {
    const user = fbService.firebaseAuth.currentUser;
    if (user?.uid) fbService.sendEmailVerification(user);
    return true;
  } catch (error) {
    // console.log("Resend Verify SignIn Email", error);
    return false;
  }
}

export async function sendForgotPasswordUrl(email: string) {
  try {
    await fbService.sendPasswordResetEmail(fbService.firebaseAuth, email);
    return true;
  } catch (error) {
    // console.log("Send Forgot Reset Email", error);
    return false;
  }
}

export async function verifyForgotPasswordUrl(actionCode: string) {
  try {
    const response = await fbService.verifyPasswordResetCode(fbService.firebaseAuth, actionCode);
    return { success: true, resource: response };
  } catch (error) {
    const err = fbService.ErrorMessage(error as fbService.FirebaseError | Error);
    return { success: false, resource: err };
  }
}

export async function updateForgotPassword(actionCode: string, newPassword: string) {
  try {
    await fbService.confirmPasswordReset(fbService.firebaseAuth, actionCode, newPassword);
    return true;
  } catch (error) {
    // console.log("Update Forgot Password", error);
    return false;
  }
}

export async function updateProfilePassword(newPassword: string) {
  try {
    const user = fbService.firebaseAuth.currentUser;
    if (user?.uid) await fbService.updatePassword(user, newPassword);
    return { success: true, resource: constants.SUCCESS };
  } catch (error) {
    const err = fbService.ErrorMessage(error as fbService.FirebaseError | Error);
    return { success: false, resource: err };
  }
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
