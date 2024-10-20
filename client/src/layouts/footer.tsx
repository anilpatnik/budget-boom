import { Link } from "react-router-dom";
import { IonFooter, IonToolbar } from "@ionic/react";
import { NavType } from "@/util";

export function Footer() {
  return (
    <IonFooter className="ion-hide-md-down ion-text-center no-boder-shadow footer">
      <IonToolbar>
        <div className="flex justify-center items-center">
          <Link id="id-privacy-policy-link" to={NavType.PrivacyPolicy}>
            privacy policy
          </Link>
          <Link
            id="id-terms-conditions-link"
            className="ion-margin-horizontal"
            to={NavType.TermsConditions}>
            terms and conditions
          </Link>
          <Link id="id-disclaimer-link" to={NavType.Disclaimer}>
            disclaimer
          </Link>
          <a
            id="id-email-contact-link"
            className="ion-margin-horizontal contact"
            href="mailto:admin@appdigital.com.au">
            admin@appdigital.com.au
          </a>
          <span id="id-copyright-text">© {new Date().getFullYear()} app digital pty ltd</span>
        </div>
      </IonToolbar>
    </IonFooter>
  );
}
