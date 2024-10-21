import { IonIcon } from "@ionic/react";
import * as Ionicons from "ionicons/icons";
import _ from "lodash";

export function Icon({
  name,
  size = 24,
  color = "black"
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const camelCaseName = _.camelCase(name);
  const ionIcon = Ionicons[camelCaseName as keyof typeof Ionicons];
  if (ionIcon) return <IonIcon icon={ionIcon} style={{ fontSize: size, color }} />;
  else return <IonIcon icon={Ionicons.homeOutline} style={{ fontSize: size, color }} />;
}
