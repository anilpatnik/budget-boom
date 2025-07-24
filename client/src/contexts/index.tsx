import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { useLocalStorage } from "usehooks-ts";
import { IUser } from "@/models";
import { constants } from "@/utils";
import { fbService } from "@/services";
import { Header, TabMenu } from "@/layouts";

type ContextProps = {
  user: IUser;
  setAuth: Dispatch<SetStateAction<IUser>>;
};
const StoreContext = createContext({} as ContextProps);
const StoreProvider = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setAuth] = useLocalStorage<IUser>(constants.AUTH, {});
  useEffect(() => {
    const unsub = fbService.onAuthStateChanged(fbService.firebaseAuth, async fbUser => {
      // if (fbUser) console.log("User signed in", fbUser);
      // else console.log("User signed out");
      await fbService.refreshToken();
      setLoading(false);
    });
    return () => unsub();
  }, []);
  return (
    <StoreContext.Provider value={{ user, setAuth }}>
      {loading ? (
        <IonPage>
          <IonContent>
            <IonSpinner className="spinner-center" name="lines-sharp-small"></IonSpinner>
          </IonContent>
        </IonPage>
      ) : (
        children
      )}
    </StoreContext.Provider>
  );
};

const useStore = () => useContext(StoreContext);
export { StoreProvider, useStore };
