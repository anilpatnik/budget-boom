import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { NavType } from "@/util";
import { useStore } from "@/contexts";

export function RootPage() {
  const { user } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (user.auth) navigate(NavType.Profile);
    else navigate(NavType.SignIn);
  }, []);
  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
