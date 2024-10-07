import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react";
import { NavType, RoleType, RouterType, constants } from "@/util";
import { StoreProvider, useStore } from "@/contexts";
import {
  RootPage,
  CallbackPage,
  SignInPage,
  SignUpPage,
  ForgotPasswordPage,
  VerifyEmailPage,
  ResetPasswordPage,
  ProfileHomePage,
  UsersHomePage,
  ProjectsHomePage
} from "@/pages";
import { Header } from "./header";
import { Footer } from "./footer";
import { TabMenu } from "./tab.menu";
import { PrivacyPolicyPage, TermsConditionsPage, DisclaimerPage } from "@/legal";

export function PreRoute({
  children,
  routerType,
  roles
}: {
  children?: any;
  routerType?: RouterType;
  roles?: RoleType[];
}) {
  const { user } = useStore();
  // role based access
  const isAllowed = roles && roles?.length > 0 && roles?.includes(user?.role ?? RoleType.User);
  // render component
  if (!user?.auth && (routerType === RouterType.User || routerType === RouterType.Role)) {
    return <Navigate to={NavType.SignInUrl} replace state={{ from: location.pathname }} />;
  } else if (user?.auth && routerType === RouterType.Auth) {
    return <Navigate to={NavType.RootUrl} replace />;
  } else if (user?.auth && routerType === RouterType.Role && !isAllowed) {
    return <Navigate to={NavType.RootUrl} replace />;
  } else {
    return children ? children : <Outlet />;
  }
}

function TabLayout() {
  return (
    <StoreProvider>
      <IonPage id="main-content">
        <Header />
        <TabMenu>
          <IonRouterOutlet>
            <IonContent className="custom-content">
              <Outlet />
            </IonContent>
          </IonRouterOutlet>
        </TabMenu>
        <Footer />
      </IonPage>
    </StoreProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: NavType.RootUrl,
    element: <TabLayout />,
    children: [
      {
        index: true,
        path: NavType.RootUrl,
        element: <RootPage />
      },
      {
        path: NavType.PrivacyPolicyUrl,
        element: <PrivacyPolicyPage />
      },
      {
        path: NavType.TermsConditionsUrl,
        element: <TermsConditionsPage />
      },
      {
        path: NavType.DisclaimerUrl,
        element: <DisclaimerPage />
      },
      {
        element: <PreRoute routerType={RouterType.Auth} />,
        children: [
          {
            path: NavType.SignInUrl,
            element: <SignInPage />
          },
          {
            path: NavType.SignUpUrl,
            element: <SignUpPage />
          },
          {
            path: NavType.ForgotPasswordUrl,
            element: <ForgotPasswordPage />
          },
          {
            path: NavType.CallbackUrl,
            element: <CallbackPage />
          },
          {
            path: `${NavType.VerifyEmailUrl}/:${constants.ACTION_CODE}`,
            element: <VerifyEmailPage />
          },
          {
            path: `${NavType.ResetPasswordUrl}/:${constants.ACTION_CODE}`,
            element: <ResetPasswordPage />
          }
        ]
      },
      {
        element: <PreRoute routerType={RouterType.User} />,
        children: [
          {
            path: NavType.ProfileUrl,
            element: <ProfileHomePage />
          }
        ]
      },
      {
        element: <PreRoute routerType={RouterType.User} />,
        children: [
          {
            path: NavType.ProjectsUrl,
            element: <ProjectsHomePage />
          },
          {
            path: `${NavType.ProjectsUrl}${NavType.NotFoundUrl}`,
            element: <Navigate to={NavType.ProjectsUrl} replace />
          }
        ]
      },
      {
        element: <PreRoute routerType={RouterType.Role} roles={[RoleType.Admin]} />,
        children: [
          {
            path: NavType.UsersUrl,
            element: <UsersHomePage />
          },
          {
            path: `${NavType.UsersUrl}${NavType.NotFoundUrl}`,
            element: <Navigate to={NavType.UsersUrl} replace />
          }
        ]
      },
      {
        path: "*",
        element: <RootPage />
      }
    ]
  }
]);
