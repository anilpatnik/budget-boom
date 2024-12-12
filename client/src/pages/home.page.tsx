import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { constants, NavType, RoleType } from "@/util";
import { useStore } from "@/contexts";

export function RootPage() {
  const hasMounted = useRef(false);
  const { user } = useStore();
  // const isFetching = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    // fetchData();
    if (user.auth && user.role === RoleType.Admin) {
      setTimeout(() => navigate(NavType.Profile), constants.DELAY);
    } else if (user.auth) {
      setTimeout(() => navigate(NavType.Expenses), constants.DELAY);
    } else {
      setTimeout(() => navigate(NavType.SignIn), constants.DELAY);
    }
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
      }, constants.DELAY);
    }
  };
  */
  return <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>;
}
