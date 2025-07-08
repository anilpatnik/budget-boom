import axios from "axios";
import { constants, config, fb, NavType } from "@/util";
import { IUser, User } from "@/models";

const ApiUrl = process.env.NODE_ENV !== "production" ? (config.VITE_API as string) : "/api";
const openApi = axios.create({ baseURL: ApiUrl });
const authApi = axios.create({ baseURL: ApiUrl });

authApi.interceptors.response.use(
  async response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      await fb.fSignOut().then(() => {
        window.location.replace(NavType.Root);
      });
    }
    return Promise.reject(error);
  }
);

export function setToken() {
  const authStore: string = localStorage.getItem(constants.AUTH) || JSON.stringify(User);
  const { token } = JSON.parse(authStore) as IUser;
  authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export * from "./auth.service";
export * from "./user.service";
export * from "./lookup.service";
export * from "./project.service";
export * from "./expense.service";
export { openApi, authApi };
