import { Link } from "react-router-dom";
import { NavType } from "@/utils/enums";

export function Footer() {
  return (
    <div className="text-center my-4 p-4">
      <div className="ion-hide-md-up">
        <div className="text-sm text-gray-700">
          <div>By using this website, you agree to our</div>
          <div className="my-2">
            <Link to={NavType.PrivacyPolicy} className="mx-1 text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            and
            <Link to={NavType.TermsConditions} className="mx-1 text-blue-600 hover:underline">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
      <div className="ion-hide-md-down">
        <div className="text-sm text-gray-700">
          By using this website, you agree to our
          <Link to={NavType.PrivacyPolicy} className="mx-1 text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          and
          <Link to={NavType.TermsConditions} className="mx-1 text-blue-600 hover:underline">
            Terms of Use
          </Link>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} App Digital Pty Ltd. All rights reserved.
      </div>
    </div>
  );
}
