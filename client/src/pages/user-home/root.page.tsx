import { useEffect } from "react";
import { IonSpinner } from "@ionic/react";
import { NavType, RoleType } from "@/utils/enums";
import { useStore } from "@/contexts";

export function RootPage() {
  const { user } = useStore();
  useEffect(() => {
    if (user.auth && user.role === RoleType.Admin) window.location.replace(NavType.Users);
    else if (user.auth) window.location.replace(NavType.Expenses);
    else window.location.replace(NavType.Home);
  }, []);
  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
