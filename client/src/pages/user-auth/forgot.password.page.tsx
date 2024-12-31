import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow
} from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { Icon, InputComponent } from "@/components";
import { NavType, config, constants, toastify } from "@/util";
import { captchaVerify, sendForgotPasswordUrl } from "@/services";

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: String.empty },
    validateOnMount: false,
    validationSchema: Yup.object({
      email: Yup.string().email("invalid email address").required("required")
    }),
    onSubmit: values => {
      handleSubmit(values.email);
    }
  });

  const handleSubmit = async (email: string) => {
    try {
      // get recaptcha response
      let captchaValue = String.empty || null;
      if (recaptchaRef.current) {
        captchaValue = recaptchaRef.current.getValue();
        if (!captchaValue) {
          toastify("Please verify reCAPTCHA!", constants.ERROR, constants.SUCCESS_DELAY);
          return;
        }
      }
      setLoading(true);
      // verify recaptcha response
      if (captchaValue) {
        const captchaRes = await captchaVerify(captchaValue);
        if (!captchaRes.success) return;
      }
      // forgot password
      const res = await sendForgotPasswordUrl(email);
      if (res) {
        setSuccess(true);
      } else {
        toastify("Email Not Found", constants.ERROR, constants.FAILURE_DELAY);
      }
    } finally {
      setTimeout(() => {
        recaptchaRef.current?.reset();
        setLoading(false);
      }, constants.DELAY);
    }
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol className="ion-hide-md-down">
          <img alt={String.empty} src={constants.BANNER_IMG} loading="lazy" />
        </IonCol>
        <IonCol sizeXs="12" sizeMd="5" sizeLg="4">
          {success && (
            <IonCard className="ion-padding-vertical">
              <IonCardHeader>
                <IonCardSubtitle>Password reset successful!</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                An email message has been sent containing a link to <strong>Reset</strong> your
                password.
                <div className="ion-margin-top">
                  <Link className="sign-label" to={NavType.SignIn}>
                    Return to
                    <IonBadge color="secondary" className="badge">
                      SIGN IN
                    </IonBadge>
                  </Link>
                </div>
              </IonCardContent>
            </IonCard>
          )}
          {!success && (
            <IonGrid>
              <IonRow className="ion-hide-md-down text-center">
                <IonCol>
                  <img
                    alt={String.empty}
                    src={constants.LOGO_IMG}
                    height={constants.LOGO_HEIGHT}
                    loading="lazy"
                    className="cursor-pointer"
                    onClick={() => navigate(NavType.Root)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonCard className="ion-padding-bottom">
                    <IonCardHeader>
                      <IonCardTitle>Forgot your password?</IonCardTitle>
                    </IonCardHeader>
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
                        <div className="ion-margin-vertical">
                          <ReCAPTCHA
                            id="id-recaptcha"
                            ref={recaptchaRef}
                            sitekey={config.VITE_CAPTCHA_SITE}
                          />
                        </div>
                        <IonButton
                          id="id-submit-button"
                          size="small"
                          type="submit"
                          className="ion-margin-vertical"
                          disabled={loading}>
                          <button type="submit" hidden />
                          {loading ? (
                            <Icon name="sync-sharp" css="icon-spinner" slot="start" />
                          ) : (
                            <Icon name="caret-forward-sharp" slot="start" />
                          )}
                          SUBMIT
                        </IonButton>
                      </form>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="ion-text-center">
                  <Link className="sign-label" to={NavType.SignIn}>
                    Return to
                    <IonBadge color="secondary" className="badge">
                      SIGN IN
                    </IonBadge>
                  </Link>
                </IonCol>
              </IonRow>
            </IonGrid>
          )}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
