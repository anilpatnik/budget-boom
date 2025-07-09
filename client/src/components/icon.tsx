import { IonIcon } from "@ionic/react";
import * as Ionicons from "ionicons/icons";

function toCamelCase(str: string) {
  return str
    .replace(/[-_ ]+(\w)/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, c => c.toLowerCase());
}

export function Icon({
  name,
  css = String.empty,
  slot = String.empty
}: {
  name: string;
  css?: string;
  slot?: string;
}) {
  const camelCaseName = toCamelCase(name);
  const ionIcon = Ionicons[camelCaseName as keyof typeof Ionicons];
  return <IonIcon icon={ionIcon ?? Ionicons.homeOutline} className={css} slot={slot} />;
}
