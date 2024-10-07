import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonLoading,
  IonRow,
  useIonToast
} from "@ionic/react";
import { caretForwardOutline, logoGoogle } from "ionicons/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { InputComponent, PasswordComponent } from "@/components";
import { NavType, RoleType, constants } from "@/util";
import { useStore } from "@/contexts";
import { captchaVerify, signInWithEmail, signInWithGoogle } from "@/services";

export function SignInPage() {
  const { setAuth } = useStore();
  const [present] = useIonToast();
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
            present({
              message: "Please verify reCAPTCHA!",
              color: "danger",
              duration: 3000
            });
            return;
          }
        }
        setLoading(true);
        // verify recaptcha response
        if (captchaValue) {
          const captchaRes = await captchaVerify(captchaValue);
          if (!captchaRes.success) return;
        }
      } else setLoading(true);
      // auth login
      const res = external ? await signInWithGoogle() : await signInWithEmail(email, password);
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
          token: res?.resource?.token
        }));
      } else {
        if (res?.resource)
          present({
            message: res?.resource,
            color: "danger",
            duration: 5000
          });
      }
    } finally {
      setTimeout(() => {
        if (!external) recaptchaRef.current?.reset();
        if (success) {
          if (state?.from) navigate(state.from);
          else navigate(NavType.RootUrl);
        }
        setLoading(false);
      }, 200);
    }
  };

  // Display a form to capture the user's email and password
  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonGrid className="flex justify-center items-center">
            <IonRow>
              <IonCol sizeSm="6">
                <IonButton
                  type="button"
                  className="google-button"
                  onClick={() => handleLogin(true, String.empty, String.empty)}>
                  <IonIcon slot="start" icon={logoGoogle} />
                  Sign In with Google
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol></IonCol>
        <IonCol size="12" size-lg="4" size-md="6">
          <IonCard className="ion-padding-bottom">
            <IonCardContent>
              <form onSubmit={formik.handleSubmit}>
                <div className="my-6">
                  <InputComponent
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
                  <PasswordComponent
                    name="password"
                    label="Password"
                    value={formik.values.password}
                    touched={formik.touched.password}
                    errorMessage={formik.errors.password}
                    handleChange={formik.handleChange}
                  />
                </div>
                <div className="ion-margin-vertical">
                  <ReCAPTCHA id="id-recaptcha" ref={recaptchaRef} sitekey={constants.CAPTCHA} />
                </div>
                <IonButton
                  id="id-submit-button"
                  size="small"
                  type="submit"
                  className="ion-margin-vertical">
                  <button type="submit" hidden />
                  <IonIcon slot="start" icon={caretForwardOutline} />
                  SIGN IN
                </IonButton>
              </form>
              <div className="ion-margin-top privacy">
                By clicking on Sign In (Google inclusive), I agree to the website
                <Link to={NavType.TermsConditionsUrl}> Terms and Conditions</Link> and
                <Link to={NavType.PrivacyPolicyUrl}> Privacy Policy</Link>
              </div>
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol></IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-text-center">
          <div>
            <Link className="sign-label" to={NavType.ForgotPasswordUrl}>
              Forgot your password?
            </Link>
          </div>
          <div className="mt-4">
            <Link className="sign-label" to={NavType.SignUpUrl}>
              Don’t have an account?
              <IonBadge color="secondary" className="badge">
                SIGN UP
              </IonBadge>
            </Link>
          </div>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="ion-text-center">
          <IonLoading isOpen={loading || false} spinner="bubbles" message="Loading..." />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
