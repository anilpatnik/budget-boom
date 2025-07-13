export function getCategories() {
  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategory(id: string) {
  return categories.find(x => x.id.toUpperCase() === id.toUpperCase()) ?? categories[0];
}

export function getCountries() {
  return countries.sort((a, b) => a.name.localeCompare(b.name));
}

export function getCountry(id: string) {
  return countries.find(x => x.id.toUpperCase() === id.toUpperCase()) ?? countries[0];
}

export const categories = [
  // Income
  {
    id: "EARNINGS",
    name: "Income",
    icon: "DollarSign",
    group: "Income"
  },
  {
    id: "BUSINESS",
    name: "Business",
    icon: "Briefcase",
    group: "Income"
  },
  {
    id: "INVESTMENTS",
    name: "Investments",
    icon: "TrendingUp",
    group: "Income"
  },
  // Housing
  {
    id: "HOME",
    name: "Home",
    icon: "Home",
    group: "Housing"
  },
  {
    id: "HOMELOAN",
    name: "Mortgage",
    icon: "Building",
    group: "Housing"
  },
  {
    id: "HOTEL",
    name: "Accommodation",
    icon: "Hotel",
    group: "Housing"
  },
  // Utilities
  {
    id: "POWER",
    name: "Power",
    icon: "Zap",
    group: "Utilities"
  },
  {
    id: "GAS",
    name: "Gas",
    icon: "Flame",
    group: "Utilities"
  },
  {
    id: "WATER",
    name: "Water",
    icon: "Droplet",
    group: "Utilities"
  },
  {
    id: "INTERNET",
    name: "Internet",
    icon: "Wifi",
    group: "Utilities"
  },
  {
    id: "MOBILE",
    name: "Mobile",
    icon: "Smartphone",
    group: "Utilities"
  },
  {
    id: "COUNCILRATES",
    name: "Council",
    icon: "Landmark",
    group: "Utilities"
  },
  // Transportation
  {
    id: "CAR",
    name: "Vehicle",
    icon: "Car",
    group: "Transportation"
  },
  {
    id: "FUEL",
    name: "Fuel",
    icon: "Fuel",
    group: "Transportation"
  },
  {
    id: "PARKING",
    name: "Parking",
    icon: "ParkingCircle",
    group: "Transportation"
  },
  {
    id: "TRAVEL",
    name: "Travel",
    icon: "Plane",
    group: "Transportation"
  },
  // Food & Drink
  {
    id: "GROCERIES",
    name: "Groceries",
    icon: "ShoppingCart",
    group: "Food"
  },
  {
    id: "FOOD",
    name: "Dining",
    icon: "Utensils",
    group: "Food"
  },
  {
    id: "CAFE",
    name: "Cafe",
    icon: "Coffee",
    group: "Food"
  },
  // Personal
  {
    id: "SHOPPING",
    name: "Shopping",
    icon: "ShoppingBag",
    group: "Personal"
  },
  {
    id: "PERSONALCARE",
    name: "Grooming",
    icon: "Scissors",
    group: "Personal"
  },
  {
    id: "HEALTH",
    name: "Health",
    icon: "Heart",
    group: "Personal"
  },
  {
    id: "PETS",
    name: "Pets",
    icon: "PawPrint",
    group: "Personal"
  },
  {
    id: "CHILDCARE",
    name: "Childcare",
    icon: "Baby",
    group: "Personal"
  },
  {
    id: "HOLIDAYS",
    name: "Holidays",
    icon: "Sun",
    group: "Personal"
  },
  // Miscellaneous
  {
    id: "NONE",
    name: "Unclassified",
    icon: "Sparkles",
    group: "Miscellaneous"
  },
  {
    id: "INTEREST",
    name: "Interest",
    icon: "CreditCard",
    group: "Miscellaneous"
  },
  {
    id: "DONATION",
    name: "Donations",
    icon: "Gift",
    group: "Miscellaneous"
  },
  {
    id: "EDUCATION",
    name: "Education",
    icon: "GraduationCap",
    group: "Miscellaneous"
  },
  {
    id: "ENTERTAINMENT",
    name: "Entertainment",
    icon: "Ticket",
    group: "Miscellaneous"
  },
  {
    id: "INSURANCE",
    name: "Insurance",
    icon: "Shield",
    group: "Miscellaneous"
  },
  {
    id: "OFFICE",
    name: "Office",
    icon: "Monitor",
    group: "Miscellaneous"
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
