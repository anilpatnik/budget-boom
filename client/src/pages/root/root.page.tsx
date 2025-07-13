import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { constants } from "@/utils";
import { NavType, RoleType } from "@/utils/enums";
import { useStore } from "@/contexts";

export function RootPage() {
  const { user } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (user.auth && user.role === RoleType.Admin) {
      setTimeout(() => navigate(NavType.Profile, { replace: true }), constants.DELAY);
    } else if (user.auth) {
      setTimeout(() => navigate(NavType.Expenses, { replace: true }), constants.DELAY);
    } else setTimeout(() => navigate(NavType.Home, { replace: true }), constants.DELAY);
  }, []);
  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
