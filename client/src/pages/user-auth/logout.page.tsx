import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { NavType, fb } from "@/util";
import { useStore } from "@/contexts";
import { User } from "@/models";

export function SignOutPage() {
  const navigate = useNavigate();
  const { setAuth } = useStore();
  useEffect(() => {
    handleLogout();
  }, []);
  const handleLogout = async () => {
    sessionStorage.clear();
    localStorage.clear();
    await fb.fSignOut();
    setAuth({ ...User });
    navigate(NavType.SignIn);
  };
  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
