import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonLabel,
  IonRow,
  IonSpinner
} from "@ionic/react";
import { constants } from "@/utils";
import { NavType } from "@/utils/enums";
import { authService } from "@/services";

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
      const res = await authService.verifySignInEmail(params.actionCode);
      setSuccess(res);
    }
    setTimeout(() => setPreLoading(false), constants.DELAY);
  };

  const resendVerificationEmail = async () => {
    const res = await authService.resendVerifySignInEmail();
    window.location.replace(NavType.Root);
  };

  if (preLoading)
    return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
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
                <IonCardSubtitle>Congratulations!</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                You have successfully verified your email address with us.
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
  } else {
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
                Verify email link is invalid or expired.
                <div className="ion-margin-top">
                  <IonButton size="small" onClick={resendVerificationEmail}>
                    Resend Verification Link
                  </IonButton>
                </div>
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
}
