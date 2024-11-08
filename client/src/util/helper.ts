export const parsePrice = (expense: boolean, price: number) => (expense ? -price : price);
export const formatPrice = (price: number) => {
  const formattedPrice = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD"
  }).format(price);
  if (price < 0) return `-${formattedPrice.slice(1)}`;
  return formattedPrice;
};
