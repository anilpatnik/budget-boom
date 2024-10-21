import { IonIcon } from "@ionic/react";
import {
  airplaneOutline,
  bagHandleOutline,
  briefcaseOutline,
  carOutline,
  cartOutline,
  cashOutline,
  giftOutline,
  heartOutline,
  homeOutline,
  receiptOutline,
  restaurantOutline,
  schoolOutline,
  sparklesOutline,
  ticketOutline
} from "ionicons/icons";
import { IconType } from "@/util";

const icons: Record<IconType, string> = {
  "briefcase-outline": briefcaseOutline,
  "gift-outline": giftOutline,
  "school-outline": schoolOutline,
  "ticket-outline": ticketOutline,
  "restaurant-outline": restaurantOutline,
  "cart-outline": cartOutline,
  "heart-outline": heartOutline,
  "home-outline": homeOutline,
  "cash-outline": cashOutline,
  "sparkles-outline": sparklesOutline,
  "bag-handle-outline": bagHandleOutline,
  "car-outline": carOutline,
  "airplane-outline": airplaneOutline,
  "receipt-outline": receiptOutline
};
export function DynamicIcon({ iconName, size = "small" }: { iconName: IconType; size?: string }) {
  const icon = icons[iconName];
  return <IonIcon icon={icon} size={size} />;
}
