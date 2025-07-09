import { IonSpinner } from "@ionic/react";
import { useEffect, useState } from "react";

export function LazyLoading({ children, delay = 200 }: { children: any; delay?: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return show ? (
    children
  ) : (
    <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>
  );
}
