export const getCategory = (id: string) =>
  categories.find(x => x.id.toUpperCase() === id.toUpperCase()) ?? categories[0];

export const getCountry = (id: string) =>
  countries.find(x => x.id.toUpperCase() === id.toUpperCase()) ?? countries[0];

export const categories = [
  {
    id: "NONE",
    name: "None",
    icon: "sparkles-outline"
  },
  {
    id: "HOME",
    name: "Home",
    icon: "home-outline"
  },
  {
    id: "INTEREST",
    name: "Interest",
    icon: "card-outline"
  },
  {
    id: "FOOD",
    name: "Food",
    icon: "restaurant-outline"
  },
  {
    id: "GROCERIES",
    name: "Groceries",
    icon: "cart-outline"
  },
  {
    id: "CAR",
    name: "Car",
    icon: "car-outline"
  },
  {
    id: "SHOPPING",
    name: "Shopping",
    icon: "bag-handle-outline"
  },
  {
    id: "UTILITIES",
    name: "Utilities",
    icon: "receipt-outline"
  },
  {
    id: "EARNINGS",
    name: "Earnings",
    icon: "cash-outline"
  },
  {
    id: "BUSINESS",
    name: "Business",
    icon: "briefcase-outline"
  },
  {
    id: "DONATION",
    name: "Donation",
    icon: "gift-outline"
  },
  {
    id: "EDUCATION",
    name: "Education",
    icon: "school-outline"
  },
  {
    id: "ENTERTAINMENT",
    name: "Entertainment",
    icon: "ticket-outline"
  },
  {
    id: "HEALTH",
    name: "Health",
    icon: "heart-outline"
  },
  {
    id: "HOTEL",
    name: "Hotel",
    icon: "bed-outline"
  },
  {
    id: "TRAVEL",
    name: "Travel",
    icon: "airplane-outline"
  }
];
export const countries = [
  { id: "AUS", name: "Australia", tax: "JUL" },
  { id: "NZ", name: "New Zealand", tax: "APR" }
];
