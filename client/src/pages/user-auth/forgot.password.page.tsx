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
  IonLabel,
  IonRow
} from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { Icon, InputField } from "@/components";
import { constants, helper } from "@/utils";
import { NavType } from "@/utils/enums";
import { VITE_CAPTCHA_SITE } from "@/utils/configs";
import { authService } from "@/services";

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
      // forgot password
      const res = await authService.sendForgotPasswordUrl(email);
      if (res) {
        setSuccess(true);
      } else {
        helper.toastify("Email Not Found", constants.ERROR, constants.FAILURE_DELAY);
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
            <IonCard className="ion-padding-vertical ion-text-center">
              <IonCardHeader className="ion-padding-bottom">
                <IonCardSubtitle>Password reset successful!</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                An email message has been sent containing a link to <strong>Reset</strong> your
                password.
                <div className="ion-margin-top">
                  <Link to={NavType.SignIn} className="flex justify-center items-center space-x-2">
                    <IonLabel>Back to</IonLabel>
                    <IonButton color="secondary" size="small" shape="round" fill="outline">
                      SIGN IN
                    </IonButton>
                  </Link>
                </div>
              </IonCardContent>
            </IonCard>
          )}
          {!success && (
            <IonGrid>
              <IonRow className="ion-hide-md-down">
                <IonCol className="flex justify-center items-center">
                  <a href={NavType.Root}>
                    <img
                      alt={String.empty}
                      src={constants.LOGO_IMG}
                      height="128px"
                      width="128px"
                      loading="lazy"
                      className="cursor-pointer"
                    />
                  </a>
                </IonCol>
              </IonRow>
              <IonRow className="ion-padding">
                <IonCol>
                  <IonCard className="ion-padding-vertical">
                    <IonCardHeader className="ion-text-center">
                      <IonCardTitle>Forgot your password?</IonCardTitle>
                    </IonCardHeader>
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
                <IonCol className="ion-text-center mt-4">
                  <Link to={NavType.SignIn} className="flex justify-center items-center space-x-2">
                    <IonLabel>Back to</IonLabel>
                    <IonButton color="secondary" size="small" shape="round" fill="outline">
                      SIGN IN
                    </IonButton>
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
