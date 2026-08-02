import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonLoading,
  IonRow
} from "@ionic/react";
import { Icon } from "@/components";
import { constants, helper } from "@/utils";
import { NavType, RoleType } from "@/utils/enums";
import { authService, fbService, lookupService } from "@/services";
import { useStore } from "@/contexts";

export function SignInPage() {
  const { setAuth } = useStore();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    let success = false;
    try {
      setLoading(true);
      const res = await authService.signInWithGoogle();
      success = res?.success;
      if (res?.success) {
        const fbUser = fbService.firebaseAuth.currentUser;
        setAuth(prev => ({
          ...prev,
          external: true,
          auth: fbUser?.emailVerified || false,
          name: fbUser?.displayName || String.empty,
          photo: fbUser?.photoURL || String.empty,
          role: res?.resource?.role || RoleType.User,
          countryId: res?.resource?.countryId,
          currency: lookupService.getCountry(res?.resource?.countryId ?? navigator.language)?.code
        }));
      } else {
        if (res?.resource) helper.toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
      }
    } finally {
      setTimeout(() => {
        if (success) {
          if (state?.from) navigate(state.from);
          else navigate(NavType.Root, { replace: true });
        }
        setLoading(false);
      }, constants.DELAY);
    }
  };

  // Sign in with Google OAuth
  return (
    <>
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
                  <IonGrid className="flex justify-center items-center">
                    <IonRow>
                      <IonCol sizeSm="6">
                        <IonButton
                          type="button"
                          className="google-button"
                          onClick={handleGoogleLogin}
                          disabled={loading}>
                          <Icon name="logo-google" slot="start" />
                          Sign In with Google
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonLoading
        isOpen={loading || false}
        spinner="circles"
        message="Loading..."
        showBackdrop={loading || false}
        translucent={loading || false}
      />
    </>
  );
}
