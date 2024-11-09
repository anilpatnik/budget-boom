import { IonIcon } from "@ionic/react";
import * as Ionicons from "ionicons/icons";
import _ from "lodash";

export function Icon({ name, css = String.empty }: { name: string; css?: string }) {
  const camelCaseName = _.camelCase(name);
  const ionIcon = Ionicons[camelCaseName as keyof typeof Ionicons];
  if (ionIcon) return <IonIcon icon={ionIcon} className={css} />;
  else return <IonIcon icon={Ionicons.homeOutline} className={css} />;
}
