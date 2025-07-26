import axios from "axios";
import { fbHelper } from "@/utils";
import { NavType } from "@/utils/enums";
import { VITE_API } from "@/utils/configs";
import { firebaseSignOut, refreshToken } from "@/services/firebase";

const ApiUrl = process.env.NODE_ENV !== "production" ? (VITE_API as string) : "/api";
const openApi = axios.create({ baseURL: ApiUrl });
const authApi = axios.create({ baseURL: ApiUrl });

authApi.interceptors.request.use(config => {
  const token = fbHelper.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

authApi.interceptors.response.use(
  res => res,
  async error => {
    const req = error.config;
    if (error.response?.status === 401 && !req._retry) {
      req._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        req.headers.Authorization = `Bearer ${newToken}`;
        return authApi(req);
      } else {
        sessionStorage.clear();
        localStorage.clear();
        await firebaseSignOut().then(() => {
          window.location.replace(NavType.Root);
        });
      }
    }
    return Promise.reject(error);
  }
);

export * as fbService from "./firebase";
export * as lookupService from "./lookup";
export * as authService from "./auth";
export * as userService from "./user";
export * as projectService from "./project";
export * as expenseService from "./expense";
export { openApi, authApi };
