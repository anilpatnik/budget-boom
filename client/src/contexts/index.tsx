import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import { constants } from "@/util";
import { IUser, User } from "@/models";
import { setToken } from "@/services";

type ContextProps = {
  user: IUser;
  setAuth: Dispatch<SetStateAction<IUser>>;
};
const StoreContext = createContext({} as ContextProps);
const StoreProvider = ({ children }: any) => {
  const [user, setAuth] = useLocalStorage<IUser>(constants.AUTH, { ...User });
  setToken(); // set auth api header token
  return <StoreContext.Provider value={{ user, setAuth }}>{children}</StoreContext.Provider>;
};

const useStore = () => useContext(StoreContext);
export { StoreProvider, useStore };
