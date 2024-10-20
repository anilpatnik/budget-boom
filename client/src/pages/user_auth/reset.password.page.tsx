import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
  IonSpinner
} from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputComponent, PasswordComponent, PasswordStrength } from "@/components";
import { NavType } from "@/util";
import { updateForgotPassword, verifyForgotPasswordUrl } from "@/services";

export function ResetPasswordPage() {
  const [preLoading, setPreLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState(String.empty);
  const params = useParams();

  // prettier-ignore
  useEffect(() => { verifyForgotPassword(); }, []);

  const formik = useFormik({
    initialValues: {
      password: String.empty,
      confirmpassword: String.empty
    },
    validateOnMount: false,
    validationSchema: Yup.object({
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
    onSubmit: values => {
      handleSubmit(values.password);
    }
  });

  const verifyForgotPassword = async () => {
    if (params.actionCode) {
      const res = await verifyForgotPasswordUrl(params.actionCode);
      if (res?.success) setEmail(res?.resource ?? String.empty);
    }
    setTimeout(() => setPreLoading(false), 200);
  };

  const handleSubmit = async (password: string) => {
    if (params.actionCode) {
      setLoading(true);
      const res = await updateForgotPassword(params.actionCode, password);
      setSuccess(res);
      setTimeout(() => setLoading(false), 200);
    }
  };

  if (preLoading)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  if (email?.length === 0) {
    return (
      <IonCard className="ion-padding-vertical">
        <IonCardHeader>
          <IonCardSubtitle>Sorry!</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Reset password link is invalid or expired.
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
  }

  if (success) {
    return (
      <IonCard className="ion-padding-vertical">
        <IonCardHeader>
          <IonCardSubtitle>Password reset successful!</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          You have successfully changed your password.
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
  }

  return (
    <IonGrid>
      <IonRow>
        <IonCol></IonCol>
        <IonCol size="12" size-lg="4" size-md="6">
          <IonCard className="ion-padding-bottom">
            <IonCardHeader>
              <IonCardTitle>Reset your Password</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={formik.handleSubmit}>
                <div className="my-6">
                  <InputComponent name="email" label="Email" type="email" value={email} disabled />
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
      <IonRow className="ion-margin-vertical">
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
  );
}
