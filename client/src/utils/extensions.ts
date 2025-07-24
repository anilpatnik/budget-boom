export {};

declare global {
  interface Date {
    addDays(days: number): Date;
    addYears(years: number): Date;
  }
  interface StringConstructor {
    empty: string;
    isNullOrEmpty(val: any): boolean;
  }
}

// date extensions
Date.prototype.addDays = function (days: number): Date {
  const result = new Date(this);
  result.setDate(result.getDate() + days);
  return result;
};
Date.prototype.addYears = function (years: number): Date {
  const result = new Date(this);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

// string extensions
String.empty = "";
String.isNullOrEmpty = function (val: any): boolean {
  return val === null || val === undefined || val === "";
};
