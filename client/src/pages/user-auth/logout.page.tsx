import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { NavType } from "@/utils/enums";
import { useStore } from "@/contexts";
import { User } from "@/models";
import { fbService } from "@/services";

export function SignOutPage() {
  const hasMounted = useRef(false);
  const navigate = useNavigate();
  const { setAuth } = useStore();
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    handleLogout();
  }, []);
  const handleLogout = async () => {
    sessionStorage.clear();
    localStorage.clear();
    await fbService.firebaseSignOut();
    setAuth({ ...User });
    navigate(NavType.Home);
  };
  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
