import { toast, Slide, TypeOptions, ToastPosition } from "react-toastify";
import { IExpense } from "@/models";
import { lookupService } from "@/services";
import { AuthType } from "@/utils/enums";

export const categoryMap = Object.fromEntries(lookupService.categories.map(cat => [cat.id, cat]));

export function parsePrice(expense: boolean, price: number) {
  return expense ? parseFloat((-1 * price)?.toString()) : parseFloat(price?.toString());
}

export function formatPrice(
  price: number,
  countryId: string = String.empty,
  currency: string = String.empty
) {
  if (countryId.length === 0 || currency.length === 0) {
    const country = lookupService.getCountry(navigator.language);
    countryId = country.id;
    currency = country.code;
  }
  const formattedPrice = new Intl.NumberFormat(countryId, {
    style: "currency",
    currency
  }).format(price);
  if (price < 0) return formattedPrice.slice(1);
  return formattedPrice;
}

export function totalPrice(items: IExpense[]) {
  return items?.map(x => x.price || 0).reduce((sum, i) => sum + i, 0);
}

export function totalIncome(items: IExpense[]) {
  return items?.map(x => (x.price && x.price > 0 ? x.price : 0)).reduce((sum, i) => sum + i, 0);
}

export function totalExpense(items: IExpense[]) {
  return items?.map(x => (x.price && x.price < 0 ? x.price : 0)).reduce((sum, i) => sum + i, 0);
}

export function toastify(
  message: string = String.empty,
  color: TypeOptions = "default",
  duration: number = 1000,
  position: ToastPosition = "top-center"
) {
  return toast(message, {
    type: color,
    autoClose: duration,
    position,
    transition: Slide
  });
}

export function externaLogin(providers: AuthType[] | undefined) {
  return providers?.some(x => x.includes(AuthType.Google) || x.includes(AuthType.Facebook));
}

export function newPassword() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$^*ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const length = 10;
  let password = String.empty;
  for (let i = 0; i < length; i++) {
    const char = Math.floor(Math.random() * chars.length + 1);
    password += chars.charAt(char);
  }
  return password;
}
