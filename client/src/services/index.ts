import axios from "axios";
import { constants } from "@/utils";
import { NavType } from "@/utils/enums";
import { VITE_API } from "@/utils/configs";
import { IUser, User } from "@/models";
import { firebaseSignOut } from "@/services/firebase";

const ApiUrl = process.env.NODE_ENV !== "production" ? (VITE_API as string) : "/api";
const openApi = axios.create({ baseURL: ApiUrl });
const authApi = axios.create({ baseURL: ApiUrl });

authApi.interceptors.response.use(
  async response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      await firebaseSignOut().then(() => {
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

export * as fbService from "./firebase";
export * as lookupService from "./lookup";
export * as authService from "./auth";
export * as userService from "./user";
export * as projectService from "./project";
export * as expenseService from "./expense";
export { openApi, authApi };
