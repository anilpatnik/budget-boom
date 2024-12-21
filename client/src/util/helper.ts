import { IExpense } from "@/models";

export const parsePrice = (expense: boolean, price: number) => (expense ? -price : price);

export const formatPrice = (price: number, currency?: string) => {
  const formattedPrice = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: currency ?? "NZD"
  }).format(price);
  if (price < 0) return formattedPrice.slice(1);
  return formattedPrice;
};

export const totalPrice = (items: IExpense[]) =>
  items?.map(x => x.price || 0).reduce((sum, i) => sum + i, 0);
