import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { NavType } from "@/utils/enums";

export function CallbackPage() {
  const hasMounted = useRef(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    const mode = searchParams.get("mode");
    const actionCode = searchParams.get("oobCode");
    if (mode?.toLocaleLowerCase() === "resetpassword")
      navigate(`${NavType.ResetPassword}/${actionCode}`);
    else if (mode?.toLocaleLowerCase() === "verifyemail")
      navigate(`${NavType.VerifyEmail}/${actionCode}`);
    else window.location.replace(NavType.Root);
  }, []);
  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
