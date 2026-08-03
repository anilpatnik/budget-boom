import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { NavType } from "@/utils/enums";

export function CallbackPage() {
  const hasMounted = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    navigate(NavType.Root, { replace: true });
  }, [navigate]);

  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
