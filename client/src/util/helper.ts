import { toast, Slide, TypeOptions, ToastPosition } from "react-toastify";
import { IExpense } from "@/models";
import { categories, getCountry } from "@/services";

export const parsePrice = (expense: boolean, price: number) => (expense ? -price : price);

export const formatPrice = (
  price: number,
  countryId: string = String.empty,
  currency: string = String.empty
) => {
  if (countryId.length === 0 || currency.length === 0) {
    const country = getCountry(navigator.language);
    countryId = country.id;
    currency = country.code;
  }
  const formattedPrice = new Intl.NumberFormat(countryId, {
    style: "currency",
    currency
  }).format(price);
  if (price < 0) return formattedPrice.slice(1);
  return formattedPrice;
};

export const totalPrice = (items: IExpense[]) =>
  items?.map(x => x.price || 0).reduce((sum, i) => sum + i, 0);

export const toastify = (
  message: string = String.empty,
  color: TypeOptions = "default",
  duration: number = 1000,
  position: ToastPosition = "top-center"
) => {
  return toast(message, {
    type: color,
    autoClose: duration,
    position,
    transition: Slide
  });
};

export const categoryMap = Object.fromEntries(categories.map(cat => [cat.id, cat]));
