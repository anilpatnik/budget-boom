import { AuthType } from "./enums";

export const externaLogin = (providers: AuthType[] | undefined) =>
  providers?.some(x => x.includes(AuthType.Google) || x.includes(AuthType.Facebook));

export const newPassword = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$^*ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const length = 10;
  let password = String.empty;
  for (let i = 0; i < length; i++) {
    const char = Math.floor(Math.random() * chars.length + 1);
    password += chars.charAt(char);
  }
  return password;
};
