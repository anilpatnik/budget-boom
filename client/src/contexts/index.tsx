import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import { constants } from "@/util";
import { IUser, User, IProject, Project } from "@/models";
import { setToken } from "@/services";

type ContextProps = {
  user: IUser;
  setAuth: Dispatch<SetStateAction<IUser>>;
  projects: IProject[];
  setProjects: Dispatch<SetStateAction<IProject[]>>;
};
const StoreContext = createContext({} as ContextProps);
const StoreProvider = ({ children }: any) => {
  const [user, setAuth] = useLocalStorage<IUser>(constants.AUTH, { ...User });
  const [projects, setProjects] = useLocalStorage<IProject[]>(constants.PROJECTS, []);
  setToken(); // set auth api header token
  return (
    <StoreContext.Provider value={{ user, setAuth, projects, setProjects }}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => useContext(StoreContext);
export { StoreProvider, useStore };
