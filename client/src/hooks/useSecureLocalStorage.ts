import { Dispatch, SetStateAction, useState } from "react";
import { helper } from "@/utils";

export function useSecureLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const getStoredValue = () => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? helper.decryptData(stored) : initialValue;
    } catch (err) {
      console.error("Decryption error:", err);
      return initialValue;
    }
  };

  const [value, setValue] = useState<T>(getStoredValue);

  const setEncryptedValue: Dispatch<SetStateAction<T>> = val => {
    const valueToStore = typeof val === "function" ? (val as Function)(value) : val;
    try {
      localStorage.setItem(key, helper.encryptData(valueToStore));
      setValue(valueToStore);
    } catch (err) {
      console.error("Encryption error:", err);
    }
  };

  return [value, setEncryptedValue];
}
