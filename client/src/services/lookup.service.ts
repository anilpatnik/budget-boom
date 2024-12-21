export const getCategories = () => categories.sort((a, b) => a.name.localeCompare(b.name));

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
    name: "Home & Repairs",
    icon: "home-outline"
  },
  {
    id: "HOMELOAN",
    name: "Home Loan",
    icon: "server-outline"
  },
  {
    id: "INTEREST",
    name: "Interest",
    icon: "card-outline"
  },
  {
    id: "FOOD",
    name: "Eating Out & Takeaway",
    icon: "restaurant-outline"
  },
  {
    id: "GROCERIES",
    name: "Groceries",
    icon: "cart-outline"
  },
  {
    id: "CAR",
    name: "Car & Repairs",
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
    name: "Income",
    icon: "cash-outline"
  },
  {
    id: "BUSINESS",
    name: "Business",
    icon: "briefcase-outline"
  },
  {
    id: "DONATION",
    name: "Gifts & Donations",
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
    name: "Health & Medical",
    icon: "fitness-outline"
  },
  {
    id: "HOTEL",
    name: "Hotel & Rent",
    icon: "bed-outline"
  },
  {
    id: "TRAVEL",
    name: "Travel & Holidays",
    icon: "airplane-outline"
  },
  {
    id: "INSURANCE",
    name: "Insurance",
    icon: "umbrella-outline"
  },
  {
    id: "PERSONALCARE",
    name: "Personal Care",
    icon: "cut-outline"
  },
  {
    id: "PETS",
    name: "Pets",
    icon: "paw-outline"
  },
  {
    id: "CHILDCARE",
    name: "Childcare",
    icon: "people-outline"
  },
  {
    id: "INVENSTMENTS",
    name: "Investments",
    icon: "diamond-outline"
  },
  {
    id: "COFFEE",
    name: "Coffee & Drinks",
    icon: "cafe-outline"
  }
];
export const countries = [
  { id: "AUD", name: "Australia", tax: "JUL" },
  { id: "NZD", name: "New Zealand", tax: "APR" }
];
