import { useEffect } from "react";
import { IonSpinner } from "@ionic/react";
import { constants } from "@/utils";
import { NavType, RoleType } from "@/utils/enums";
import { useStore } from "@/contexts";

export function RootPage() {
  const { user } = useStore();
  useEffect(() => {
    if (user.auth && user.role === RoleType.Admin) {
      setTimeout(() => window.location.replace(NavType.Profile), constants.DELAY);
    } else if (user.auth) {
      setTimeout(() => window.location.replace(NavType.Expenses), constants.DELAY);
    } else setTimeout(() => window.location.replace(NavType.Home), constants.DELAY);
  }, []);
  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
