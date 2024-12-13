import { Link } from "react-router-dom";
import { IonFooter, IonToolbar } from "@ionic/react";
import { NavType } from "@/util";

export function Footer() {
  return (
    <IonFooter className="ion-hide-md-down footer border-0 shadow-none text-center">
      <IonToolbar>
        <div className="flex justify-center items-center">
          <Link id="id-terms-conditions-link" className="mr-2" to={NavType.TermsConditions}>
            terms and conditions
          </Link>
          <Link id="id-privacy-policy-link" className="ml-2" to={NavType.PrivacyPolicy}>
            privacy policy
          </Link>
          <a
            id="id-email-contact-link"
            className="mx-5 text-xs lowercase"
            href="mailto:admin@appdigital.com.au">
            admin@appdigital.com.au
          </a>
          <span id="id-copyright-text">© {new Date().getFullYear()} app digital pty ltd</span>
        </div>
      </IonToolbar>
    </IonFooter>
  );
}
