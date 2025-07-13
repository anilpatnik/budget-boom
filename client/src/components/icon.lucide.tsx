import { ComponentType } from "react";
import * as Icons from "lucide-react";

type Props = {
  name: string;
  css?: string;
};
export function LucideIcon({ name, css = String.empty }: Props) {
  const IconLucide = Icons[name as keyof typeof Icons] as ComponentType<{ className?: string }>;
  return IconLucide ? <IconLucide className={css} /> : <Icons.Home />;
}
