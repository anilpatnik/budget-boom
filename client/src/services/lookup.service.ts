export const getCategories = () => categories.sort((a, b) => a.name.localeCompare(b.name));
export const getCategory = (id: string) =>
  categories.find(x => x.id.toUpperCase() === id.toUpperCase()) ?? categories[0];

export const getCountries = () => countries.sort((a, b) => a.name.localeCompare(b.name));
export const getCountry = (id: string) =>
  countries.find(x => x.id.toUpperCase() === id.toUpperCase()) ?? countries[0];

export const categories = [
  {
    id: "NONE",
    name: "Unclassified",
    icon: "sparkles-outline"
  },
  {
    id: "HOME",
    name: "Home Maintenance",
    icon: "home-outline"
  },
  {
    id: "HOMELOAN",
    name: "Home Loan",
    icon: "server-outline"
  },
  {
    id: "INTEREST",
    name: "Interest Paid",
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
    name: "Vehicle Maintenance",
    icon: "car-outline"
  },
  {
    id: "FUEL",
    name: "Vehicle Fuel",
    icon: "scale-outline"
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
    name: "Earned Income",
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
  {
    id: "en-AU",
    name: "Australia",
    code: "AUD",
    tax: "July"
  },
  {
    id: "en-NZ",
    name: "New Zealand",
    code: "NZD",
    tax: "April"
  },
  {
    id: "en-US",
    name: "United States",
    code: "USD",
    tax: "April"
  },
  {
    id: "en-GB",
    name: "United Kingdom",
    code: "GBP",
    tax: "January"
  },
  {
    id: "fr-FR",
    name: "France",
    code: "EUR",
    tax: "May"
  },
  {
    id: "de-DE",
    name: "Germany",
    code: "EUR",
    tax: "May"
  },
  {
    id: "es-ES",
    name: "Spain",
    code: "EUR",
    tax: "May"
  },
  {
    id: "it-IT",
    name: "Italy",
    code: "EUR",
    tax: "May"
  },
  {
    id: "pt-PT",
    name: "Portugal",
    code: "EUR",
    tax: "April"
  },
  {
    id: "ja-JP",
    name: "Japan",
    code: "JPY",
    tax: "March"
  },
  {
    id: "ko-KR",
    name: "South Korea",
    code: "KRW",
    tax: "May"
  },
  {
    id: "zh-CN",
    name: "China",
    code: "CNY",
    tax: "March"
  },
  {
    id: "hi-IN",
    name: "India",
    code: "INR",
    tax: "March"
  },
  {
    id: "af-ZA",
    name: "South Africa",
    code: "ZAR",
    tax: "October"
  },
  {
    id: "en-CA",
    name: "Canada",
    code: "CAD",
    tax: "April"
  },
  {
    id: "ru-RU",
    name: "Russia",
    code: "RUB",
    tax: "April"
  },
  {
    id: "en-IE",
    name: "Ireland",
    code: "EUR",
    tax: "October"
  },
  {
    id: "sv-SE",
    name: "Sweden",
    code: "SEK",
    tax: "May"
  },
  {
    id: "fi-FI",
    name: "Finland",
    code: "EUR",
    tax: "May"
  },
  {
    id: "no-NO",
    name: "Norway",
    code: "NOK",
    tax: "May"
  },
  {
    id: "da-DK",
    name: "Denmark",
    code: "DKK",
    tax: "May"
  },
  {
    id: "en-NL",
    name: "Netherlands",
    code: "EUR",
    tax: "May"
  },
  {
    id: "en-BR",
    name: "Brazil",
    code: "BRL",
    tax: "April"
  }
];
