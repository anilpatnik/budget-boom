import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonSpinner
} from "@ionic/react";
import { NavType } from "@/util";
import { resendVerifySignInEmail, verifySignInEmail } from "@/services";

export function VerifyEmailPage() {
  const [preLoading, setPreLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  // prettier-ignore
  useEffect(() => { verifyEmail(); }, []);

  const verifyEmail = async () => {
    if (params.actionCode) {
      const res = await verifySignInEmail(params.actionCode);
      setSuccess(res);
    }
    setTimeout(() => setPreLoading(false), 200);
  };

  const resendVerificationEmail = async () => {
    const res = await resendVerifySignInEmail();
    navigate(NavType.Root);
  };

  if (preLoading)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
  if (success) {
    return (
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
    );
  } else {
    return (
      <IonCard className="ion-padding-vertical">
        <IonCardHeader>
          <IonCardSubtitle>Sorry!</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          Verify email link is invalid or expired.
          <div className="ion-margin-top">
            <IonButton size="small" aria-hidden="false" onClick={resendVerificationEmail}>
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
    );
  }
}
