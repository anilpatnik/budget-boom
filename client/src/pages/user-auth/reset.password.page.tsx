import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonLabel,
  IonRow,
  IonSpinner
} from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon, InputField, PasswordField, PasswordStrength } from "@/components";
import { constants } from "@/utils";
import { NavType } from "@/utils/enums";
import { authService } from "@/services";

export function ResetPasswordPage() {
  const hasMounted = useRef(false);
  const [preLoading, setPreLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState(String.empty);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    verifyForgotPassword();
  }, []);

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
      const res = await authService.verifyForgotPasswordUrl(params.actionCode);
      if (res?.success) setEmail(res?.resource ?? String.empty);
    }
    setTimeout(() => setPreLoading(false), constants.DELAY);
  };

  const handleSubmit = async (password: string) => {
    if (params.actionCode) {
      setLoading(true);
      const res = await authService.updateForgotPassword(params.actionCode, password);
      setSuccess(res);
      setTimeout(() => setLoading(false), constants.DELAY);
    }
  };

  if (preLoading)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;

  if (email?.length === 0) {
    return (
      <IonGrid>
        <IonRow>
          <IonCol className="ion-hide-md-down">
            <img alt={String.empty} src={constants.BANNER_IMG} loading="lazy" />
          </IonCol>
          <IonCol sizeXs="12" sizeMd="5" sizeLg="4">
            <IonCard className="ion-padding-vertical ion-text-center">
              <IonCardHeader className="ion-padding-bottom">
                <IonCardSubtitle>Sorry!</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                Reset password link is invalid or expired.
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
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  if (success) {
    return (
      <IonGrid>
        <IonRow>
          <IonCol className="ion-hide-md-down">
            <img alt={String.empty} src={constants.BANNER_IMG} loading="lazy" />
          </IonCol>
          <IonCol sizeXs="12" sizeMd="5" sizeLg="4">
            <IonCard className="ion-padding-vertical ion-text-center">
              <IonCardHeader className="ion-padding-bottom">
                <IonCardSubtitle>Password reset successful!</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                You have successfully changed your password.
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
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  return (
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
                    <IonCardTitle>Reset your Password</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="my-6">
                        <InputField
                          name="email"
                          label="Email"
                          type="email"
                          value={email}
                          disabled
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
            <IonRow className="ion-margin-vertical">
              <IonCol className="ion-text-center">
                <Link to={NavType.SignIn} className="flex justify-center items-center space-x-2">
                  <IonLabel>Back to</IonLabel>
                  <IonButton color="secondary" size="small" shape="round" fill="outline">
                    SIGN IN
                  </IonButton>
                </Link>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
