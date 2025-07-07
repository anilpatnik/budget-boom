import { IToken } from "../models";
export {};

declare global {
  interface StringConstructor {
    empty: string;
    isNullOrEmpty: (val: any) => boolean;
  }
  namespace Express {
    interface Request extends IToken {
      auth?: IToken;
    }
  }
}

// string extensions
String.empty = "";
String.isNullOrEmpty = function (val: any): boolean {
  return !val ? true : false;
};
