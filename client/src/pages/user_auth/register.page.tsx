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
import { caretForwardOutline, refreshOutline } from "ionicons/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { InputComponent, PasswordComponent, PasswordStrength } from "@/components";
import { NavType, constants } from "@/util";
import { captchaVerify, createUserWithEmail } from "@/services";

export function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [present] = useIonToast();

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
      // create auth user
      const res = await createUserWithEmail(name, email, password);
      if (res?.success) {
        setSuccess(true);
      } else {
        present({
          message: res?.resource,
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
          <IonCardSubtitle>Thank you for signing up!</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          An email message has been sent containing a link to <strong>Activate</strong> your
          account.
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
    );
  } else {
    return (
      <IonGrid>
        <IonRow>
          <IonCol></IonCol>
          <IonCol size="12" size-lg="4" size-md="6">
            <IonCard className="ion-padding-bottom">
              <IonCardHeader>
                <IonCardTitle>Sign Up</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <form onSubmit={formik.handleSubmit}>
                  <div className="my-6">
                    <InputComponent
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
                    <PasswordStrength password={formik.values.password} />
                  </div>
                  <div className="my-6">
                    <PasswordComponent
                      name="confirmpassword"
                      label="Confirm Password"
                      value={formik.values.confirmpassword}
                      touched={formik.touched.confirmpassword}
                      errorMessage={formik.errors.confirmpassword}
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
                    aria-hidden="false"
                    disabled={loading}>
                    <button type="submit" hidden />
                    {loading ? (
                      <IonSpinner name="lines-sharp-small"></IonSpinner>
                    ) : (
                      <IonIcon slot="start" icon={caretForwardOutline} />
                    )}
                    SIGN UP
                  </IonButton>
                  <IonButton
                    className="ion-margin-horizontal"
                    size="small"
                    color="light"
                    aria-hidden="false"
                    onClick={formik.handleReset}>
                    <IonIcon icon={refreshOutline} slot="start" />
                    RESET
                  </IonButton>
                </form>
                <div className="ion-margin-top privacy">
                  By clicking on Sign Up, I agree to the website
                  <Link to={NavType.TermsConditions}> Terms and Conditions</Link> and
                  <Link to={NavType.PrivacyPolicy}> Privacy Policy</Link>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol></IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="ion-text-center">
            <Link className="sign-label" to={NavType.SignIn}>
              Already have an account?
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
