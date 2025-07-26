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
import { Icon, InputField, PasswordField, PasswordStrength } from "@/components";
import { constants, helper } from "@/utils";
import { VITE_CAPTCHA_SITE } from "@/utils/configs";
import { NavType } from "@/utils/enums";
import { authService } from "@/services";

export function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: String.empty,
      email: String.empty,
      password: String.empty,
      confirmpassword: String.empty
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      name: Yup.string().required("required"),
      email: Yup.string().email("invalid email address").required("required"),
      password: Yup.string().min(8).required("required"),
      confirmpassword: Yup.string()
        .min(8)
        .required("required")
        .when("password", {
          is: (val: string) => (val && val.length > 0 ? true : false),
          then: schema =>
            schema.oneOf([Yup.ref("password")], "confirm password does not match password")
        })
    }),
    onSubmit: values => handleSubmit(values.name, values.email, values.password)
  });

  // Handle submission of the sign-up form
  const handleSubmit = async (name: string, email: string, password: string) => {
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
      // create auth user
      const res = await authService.createUserWithEmail(name, email, password);
      if (res?.success) {
        setSuccess(true);
      } else {
        helper.toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
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
                <IonCardSubtitle>Thank you for signing up!</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                An email message has been sent containing a link to <strong>Activate</strong> your
                account.
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
                  <IonCard className="ion-padding-vertical">
                    <IonCardHeader className="ion-text-center">
                      <IonCardTitle>Sign Up</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <form onSubmit={formik.handleSubmit}>
                        <div className="my-6">
                          <InputField
                            name="name"
                            label="Name"
                            type="text"
                            value={formik.values.name}
                            touched={formik.touched.name}
                            errorMessage={formik.errors.name}
                            handleChange={formik.handleChange}
                          />
                        </div>
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
                          <PasswordStrength password={formik.values.password} />
                        </div>
                        <div className="my-6">
                          <PasswordField
                            name="confirmpassword"
                            label="Confirm Password"
                            value={formik.values.confirmpassword}
                            touched={formik.touched.confirmpassword}
                            errorMessage={formik.errors.confirmpassword}
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
                          SIGN UP
                        </IonButton>
                        <IonButton
                          className="ion-margin-horizontal"
                          size="small"
                          color="light"
                          onClick={formik.handleReset}>
                          <Icon name="refresh-sharp" slot="start" />
                          RESET
                        </IonButton>
                      </form>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="ion-text-center mt-4">
                  <Link to={NavType.SignIn} className="flex justify-center items-center space-x-2">
                    <IonLabel>Already have an account?</IonLabel>
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
