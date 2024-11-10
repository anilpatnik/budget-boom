import { VITE_CAPTCHA_SITE } from "./config";
import stockImg from "@/assets/stock.jpg";

export const STOCK_IMG = stockImg;
export const CAPTCHA = VITE_CAPTCHA_SITE;
// patterns
export const TWO_DECIMAL_PATTERN = /^\d+(\.\d{0,2})?$/;
// numbers
export const TWENTY_FOUR_HOURS_IN_MS = 1000 * 60 * 60 * 24;
export const TOKEN_LENGTH = 10;
export const PAGE_SIZE = 10;
export const PROJECTS_MAX = 250;
// strings
export const ACTION_CODE = "actionCode";
export const AUTH = "auth";
export const PROJECTS = "projects";
export const SUCCESS = "success";
export const DANGER = "danger";
