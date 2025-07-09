import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonLabel,
  IonLoading,
  IonRow
} from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { Icon, InputField, PasswordField } from "@/components";
import { constants, helper } from "@/utils";
import { NavType, RoleType } from "@/utils/enums";
import { VITE_CAPTCHA_SITE } from "@/utils/configs";
import { authService, lookupService } from "@/services";
import { useStore } from "@/contexts";

export function SignInPage() {
  const { setAuth } = useStore();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const formik = useFormik({
    initialValues: {
      email: String.empty,
      password: String.empty
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      email: Yup.string().email("invalid email address").required("required"),
      password: Yup.string().required("required")
    }),
    onSubmit: values => {
      handleLogin(false, values.email, values.password);
    }
  });

  // Handle the submission of the sign-in form
  const handleLogin = async (external: boolean, email: string, password: string) => {
    let success = false;
    let auth = false;
    let role = RoleType.User;
    try {
      if (!external) {
        // get recaptcha response
        let captchaValue = String.empty || null;
        if (recaptchaRef.current) {
          captchaValue = recaptchaRef.current.getValue();
          if (!captchaValue) {
            helper.toastify("Please verify reCAPTCHA!", constants.ERROR, constants.SUCCESS_DELAY);
            return;
          }
        }
        setLoading(true);
        // verify recaptcha response
        if (captchaValue) {
          const captchaRes = await authService.captchaVerify(captchaValue);
          if (!captchaRes.success) return;
        }
      } else setLoading(true);
      // auth login
      const res = external
        ? await authService.signInWithGoogle()
        : await authService.signInWithEmail(email, password);
      success = res?.success;
      if (res?.success) {
        auth = res?.resource?.token?.length > constants.TOKEN_LENGTH;
        role = res?.resource?.role || RoleType.User;
        setAuth(prev => ({
          ...prev,
          external,
          auth,
          name: res?.resource?.name,
          email: res?.resource?.email,
          role: res?.resource?.role,
          photo: res?.resource?.photo,
          token: res?.resource?.token,
          countryId: res?.resource?.countryId,
          currency: lookupService.getCountry(res?.resource?.countryId ?? navigator.language)?.code
        }));
      } else {
        if (res?.resource) helper.toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
      }
    } finally {
      setTimeout(() => {
        if (!external) recaptchaRef.current?.reset();
        if (success) {
          if (state?.from) navigate(state.from);
          else window.location.replace(NavType.Root);
        }
        setLoading(false);
      }, constants.DELAY);
    }
  };

  // Display a form to capture the user's email and password
  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol className="ion-hide-md-down">
            <img alt={String.empty} src={constants.BANNER_IMG} loading="lazy" />
          </IonCol>
          <IonCol sizeXs="12" sizeMd="5" sizeLg="4">
            <IonGrid>
              <IonRow className="ion-hide-md-down">
                <IonCol className="flex justify-center items-center">
                  <a href={NavType.Root}>
                    <img
                      alt={String.empty}
                      src={constants.LOGO_IMG}
                      height="64px"
                      width="64px"
                      loading="lazy"
                      className="cursor-pointer"
                    />
                  </a>
                </IonCol>
              </IonRow>
              <IonRow className="ion-padding">
                <IonCol>
                  <IonGrid className="flex justify-center items-center">
                    <IonRow>
                      <IonCol sizeSm="6">
                        <IonButton
                          type="button"
                          className="google-button"
                          onClick={() => handleLogin(true, String.empty, String.empty)}>
                          <Icon name="logo-google" slot="start" />
                          Sign In with Google
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>
              <IonRow className="ion-padding">
                <IonCol>
                  <IonCard>
                    <IonCardContent>
                      <form onSubmit={formik.handleSubmit}>
                        <div className="my-6">
                          <InputField
                            name="email"
                            label="Email"
                            type="email"
                            value={formik.values.email}
                            touched={formik.touched.email}
                            errorMessage={formik.errors.email}
                            handleChange={formik.handleChange}
                          />
                        </div>
                        <div className="my-6">
                          <PasswordField
                            name="password"
                            label="Password"
                            value={formik.values.password}
                            touched={formik.touched.password}
                            errorMessage={formik.errors.password}
                            handleChange={formik.handleChange}
                          />
                        </div>
                        <div className="ion-margin-vertical">
                          <ReCAPTCHA
                            id="id-recaptcha"
                            ref={recaptchaRef}
                            sitekey={VITE_CAPTCHA_SITE}
                          />
                        </div>
                        <IonButton
                          id="id-submit-button"
                          size="small"
                          type="submit"
                          className="ion-margin-vertical">
                          <button type="submit" hidden />
                          <Icon name="caret-forward-sharp" slot="start" />
                          SIGN IN
                        </IonButton>
                      </form>
                      <div className="ion-margin-top privacy">
                        By clicking on Sign In (Google inclusive), I agree to the website
                        <Link to={NavType.TermsConditions}> Terms and Conditions</Link> and
                        <Link to={NavType.PrivacyPolicy}> Privacy Policy</Link>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="ion-text-center mt-4">
                  <Link to={NavType.SignUp} className="flex justify-center items-center space-x-2">
                    <IonLabel>Do not have an account?</IonLabel>
                    <IonButton color="secondary" size="small" shape="round" fill="outline">
                      SIGN UP
                    </IonButton>
                  </Link>
                  <div className="mt-4">
                    <Link to={NavType.ForgotPassword}>Forgot your password?</Link>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonLoading
        isOpen={loading || false}
        spinner="circles"
        message="Loading..."
        showBackdrop={loading || false}
        translucent={loading || false}
      />
    </>
  );
}
