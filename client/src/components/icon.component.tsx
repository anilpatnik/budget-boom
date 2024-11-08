import { IonIcon } from "@ionic/react";
import * as Ionicons from "ionicons/icons";
import _ from "lodash";

export function Icon({
  name,
  size = 24,
  color = "black",
  title = String.empty,
  css = String.empty
}: {
  name: string;
  size?: number;
  color?: string;
  title?: string;
  css?: string;
}) {
  const camelCaseName = _.camelCase(name);
  const ionIcon = Ionicons[camelCaseName as keyof typeof Ionicons];
  if (ionIcon)
    return (
      <IonIcon icon={ionIcon} title={title} style={{ fontSize: size, color }} className={css} />
    );
  else
    return (
      <IonIcon icon={Ionicons.homeOutline} style={{ fontSize: size, color }} className={css} />
    );
}
