import { ErrorMessage, ServiceType, constants, fb } from "@/util";
import { authApi, openApi } from "./index";

export const createUserWithEmail = async (name: string, email: string, password: string) => {
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
};

export const signInWithEmail = async (email: string, password: string) => {
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
};

export const signInWithGoogle = async () => {
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
};

export const getUser = async (fbUser: fb.UserCredential) => {
  // const zone = new Date().getTimezoneOffset().toString();
  const response = await openApi.post(ServiceType.SignInUrl, fbUser.user);
  const { success, resource } = response.data;
  return { success, resource };
};

export const verifySignInEmail = async (actionCode: string) => {
  try {
    await fb.applyActionCode(fb.fAuth, actionCode);
    return true;
  } catch (error) {
    // console.log("Verify SignIn Email", error);
    return false;
  }
};

export const resendVerifySignInEmail = async () => {
  try {
    const user = fb.fAuth.currentUser;
    if (user?.uid) fb.sendEmailVerification(user);
    return true;
  } catch (error) {
    // console.log("Resend Verify SignIn Email", error);
    return false;
  }
};

export const sendForgotPasswordUrl = async (email: string) => {
  try {
    await fb.sendPasswordResetEmail(fb.fAuth, email);
    return true;
  } catch (error) {
    // console.log("Send Forgot Reset Email", error);
    return false;
  }
};

export const verifyForgotPasswordUrl = async (actionCode: string) => {
  try {
    const response = await fb.verifyPasswordResetCode(fb.fAuth, actionCode);
    return { success: true, resource: response };
  } catch (error) {
    const err = ErrorMessage(error as fb.FirebaseError | Error);
    return { success: false, resource: err };
  }
};

export const updateForgotPassword = async (actionCode: string, newPassword: string) => {
  try {
    await fb.confirmPasswordReset(fb.fAuth, actionCode, newPassword);
    return true;
  } catch (error) {
    // console.log("Update Forgot Password", error);
    return false;
  }
};

export const updateProfilePassword = async (newPassword: string) => {
  try {
    const user = fb.fAuth.currentUser;
    if (user?.uid) await fb.updatePassword(user, newPassword);
    return { success: true, resource: constants.SUCCESS };
  } catch (error) {
    const err = ErrorMessage(error as fb.FirebaseError | Error);
    return { success: false, resource: err };
  }
};

export const updateProfilePic = async (photoURL: string) => {
  try {
    const user = fb.fAuth.currentUser;
    if (user?.uid) await fb.updateProfile(user, { photoURL });
    return { success: true, resource: constants.SUCCESS };
  } catch (error) {
    const err = ErrorMessage(error as fb.FirebaseError | Error);
    return { success: false, resource: err };
  }
};

export const updateProfileInfo = async (name: string) => {
  try {
    const response = await authApi.post(ServiceType.ProfileUrl, { name });
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};

export const deleteProfileAsync = async () => {
  try {
    const response = await authApi.delete(ServiceType.ProfileUrl);
    const { success, resource } = response.data;
    return { success, resource };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};

export const captchaVerify = async (token: string) => {
  try {
    const response = await openApi.post(ServiceType.CaptchaUrl, { token });
    const { success, hostname } = response.data;
    return { success, resource: hostname };
  } catch (error) {
    const err = error as Error;
    return { success: false, resource: err.message };
  }
};
