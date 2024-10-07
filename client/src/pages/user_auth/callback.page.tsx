import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { NavType } from "@/util";

export function CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const mode = searchParams.get("mode");
    const actionCode = searchParams.get("oobCode");
    if (mode?.toLocaleLowerCase() === "resetpassword")
      navigate(`${NavType.ResetPasswordUrl}/${actionCode}`);
    else if (mode?.toLocaleLowerCase() === "verifyemail")
      navigate(`${NavType.VerifyEmailUrl}/${actionCode}`);
    else navigate(NavType.RootUrl);
  }, []);
  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
