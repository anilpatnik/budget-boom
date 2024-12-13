import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonRow,
  IonSpinner
} from "@ionic/react";
import { constants, NavType } from "@/util";
import { resendVerifySignInEmail, verifySignInEmail } from "@/services";
import logo from "@/assets/logo.png";
import banner from "@/assets/banner.png";

export function VerifyEmailPage() {
  const hasMounted = useRef(false);
  const [preLoading, setPreLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    if (params.actionCode) {
      const res = await verifySignInEmail(params.actionCode);
      setSuccess(res);
    }
    setTimeout(() => setPreLoading(false), constants.DELAY);
  };

  const resendVerificationEmail = async () => {
    const res = await resendVerifySignInEmail();
    navigate(NavType.Root);
  };

  if (preLoading)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
  if (success) {
    return (
      <IonGrid>
        <IonRow>
          <IonCol className="ion-hide-md-down">
            <img alt={String.empty} src={banner} loading="lazy" />
          </IonCol>
          <IonCol sizeXs="12" sizeMd="5" sizeLg="4">
            <IonCard className="ion-padding-vertical">
              <IonCardHeader>
                <IonCardSubtitle>Congratulations!</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                You have successfully verified your email address with us.
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
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  } else {
    return (
      <IonGrid>
        <IonRow>
          <IonCol className="ion-hide-md-down">
            <img alt={String.empty} src={banner} loading="lazy" />
          </IonCol>
          <IonCol sizeXs="12" sizeMd="5" sizeLg="4">
            <IonCard className="ion-padding-vertical">
              <IonCardHeader>
                <IonCardSubtitle>Sorry!</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                Verify email link is invalid or expired.
                <div className="ion-margin-top">
                  <IonButton size="small" onClick={resendVerificationEmail}>
                    Resend Verification Link
                  </IonButton>
                </div>
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
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }
}
