import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { NavType } from "@/util";
import { useStore } from "@/contexts";

export function RootPage() {
  const { user } = useStore();
  // const isFetching = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.auth) navigate(NavType.Profile); // fetchData();
    else navigate(NavType.SignIn);
  }, []);

  /*
  const fetchData = async () => {
    try {
      // request is already in progress
      if (isFetching.current) return;
      // prevent another request
      isFetching.current = true;
      const projects = await getAllProjectsAsync();
      setProjects(projects);
    } catch (error) {
      const err = error as Error;
      // console.log("initial fetch", err.message);
    } finally {
      setTimeout(() => {
        // reset to allow new request
        isFetching.current = false;
        navigate(NavType.Profile);
      }, 200);
    }
  };
  */

  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
