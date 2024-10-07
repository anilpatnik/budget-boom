import { useState, useRef } from "react";
import { Link } from "react-router-dom";
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
  IonIcon,
  IonRow,
  IonSpinner,
  useIonToast
} from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { InputComponent } from "@/components";
import { NavType, constants } from "@/util";
import { captchaVerify, sendForgotPasswordUrl } from "@/services";

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [present] = useIonToast();

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
      // forgot password
      const res = await sendForgotPasswordUrl(email);
      if (res) {
        setSuccess(true);
      } else {
        present({
          message: "Email Not Found",
          color: "danger",
          duration: 5000
        });
      }
    } finally {
      setTimeout(() => {
        recaptchaRef.current?.reset();
        setLoading(false);
      }, 200);
    }
  };

  if (success) {
    return (
      <IonCard className="ion-padding-vertical">
        <IonCardHeader>
          <IonCardSubtitle>Password reset successful!</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          An email message has been sent containing a link to <strong>Reset</strong> your password.
          <div className="ion-margin-top">
            <Link className="sign-label" to={NavType.SignInUrl}>
              Return to
              <IonBadge color="secondary" className="badge">
                SIGN IN
              </IonBadge>
            </Link>
          </div>
        </IonCardContent>
      </IonCard>
    );
  } else {
    return (
      <IonGrid>
        <IonRow>
          <IonCol></IonCol>
          <IonCol size="12" size-lg="4" size-md="6">
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
                    <ReCAPTCHA id="id-recaptcha" ref={recaptchaRef} sitekey={constants.CAPTCHA} />
                  </div>
                  <IonButton
                    id="id-submit-button"
                    size="small"
                    type="submit"
                    className="ion-margin-vertical"
                    disabled={loading}>
                    <button type="submit" hidden />
                    {loading ? (
                      <IonSpinner name="lines-sharp-small"></IonSpinner>
                    ) : (
                      <IonIcon slot="start" icon={caretForwardOutline} />
                    )}
                    SUBMIT
                  </IonButton>
                </form>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol></IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-text-center">
            <Link className="sign-label" to={NavType.SignInUrl}>
              Return to
              <IonBadge color="secondary" className="badge">
                SIGN IN
              </IonBadge>
            </Link>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }
}
