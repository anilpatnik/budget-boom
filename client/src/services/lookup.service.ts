export const getCategory = (id: string) =>
  categories.find(x => x.id.toUpperCase() === id.toUpperCase()) ?? categories[0];

export const getCountry = (id: string) =>
  countries.find(x => x.id.toUpperCase() === id.toUpperCase()) ?? countries[0];

export const categories = [
  {
    id: "NONE",
    name: "None",
    icon: "sparkles-sharp"
  },
  {
    id: "HOME",
    name: "Home",
    icon: "home-sharp"
  },
  {
    id: "INTEREST",
    name: "Interest",
    icon: "card-sharp"
  },
  {
    id: "FOOD",
    name: "Food",
    icon: "restaurant-sharp"
  },
  {
    id: "GROCERIES",
    name: "Groceries",
    icon: "cart-sharp"
  },
  {
    id: "CAR",
    name: "Car",
    icon: "car-sharp"
  },
  {
    id: "SHOPPING",
    name: "Shopping",
    icon: "bag-handle-sharp"
  },
  {
    id: "UTILITIES",
    name: "Utilities",
    icon: "receipt-sharp"
  },
  {
    id: "EARNINGS",
    name: "Earnings",
    icon: "cash-sharp"
  },
  {
    id: "BUSINESS",
    name: "Business",
    icon: "briefcase-sharp"
  },
  {
    id: "DONATION",
    name: "Donation",
    icon: "gift-sharp"
  },
  {
    id: "EDUCATION",
    name: "Education",
    icon: "school-sharp"
  },
  {
    id: "ENTERTAINMENT",
    name: "Entertainment",
    icon: "ticket-sharp"
  },
  {
    id: "HEALTH",
    name: "Health",
    icon: "heart-sharp"
  },
  {
    id: "HOTEL",
    name: "Hotel",
    icon: "bed-sharp"
  },
  {
    id: "TRAVEL",
    name: "Travel",
    icon: "airplane-sharp"
  }
];
export const countries = [
  { id: "AUS", name: "Australia", tax: "JUL" },
  { id: "NZ", name: "New Zealand", tax: "APR" }
];
