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
    return <Navigate to={NavType.SignIn} replace state={{ from: location.pathname }} />;
  } else if (user?.auth && routerType === RouterType.Auth) {
    return <Navigate to={NavType.Root} replace />;
  } else if (user?.auth && routerType === RouterType.Role && !isAllowed) {
    return <Navigate to={NavType.Root} replace />;
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
    path: NavType.Root,
    element: <TabLayout />,
    children: [
      {
        index: true,
        path: NavType.Root,
        element: <RootPage />
      },
      {
        path: NavType.PrivacyPolicy,
        element: <PrivacyPolicyPage />
      },
      {
        path: NavType.TermsConditions,
        element: <TermsConditionsPage />
      },
      {
        path: NavType.Disclaimer,
        element: <DisclaimerPage />
      },
      {
        element: <PreRoute routerType={RouterType.Auth} />,
        children: [
          {
            path: NavType.SignIn,
            element: <SignInPage />
          },
          {
            path: NavType.SignUp,
            element: <SignUpPage />
          },
          {
            path: NavType.ForgotPassword,
            element: <ForgotPasswordPage />
          },
          {
            path: NavType.Callback,
            element: <CallbackPage />
          },
          {
            path: `${NavType.VerifyEmail}/:${constants.ACTION_CODE}`,
            element: <VerifyEmailPage />
          },
          {
            path: `${NavType.ResetPassword}/:${constants.ACTION_CODE}`,
            element: <ResetPasswordPage />
          }
        ]
      },
      {
        element: <PreRoute routerType={RouterType.User} />,
        children: [
          {
            path: NavType.Profile,
            element: <ProfileHomePage />
          }
        ]
      },
      {
        element: <PreRoute routerType={RouterType.User} roles={[RoleType.User]} />,
        children: [
          {
            path: NavType.Projects,
            element: <ProjectsHomePage />
          },
          {
            path: `${NavType.Projects}${NavType.NotFound}`,
            element: <Navigate to={NavType.Projects} replace />
          }
        ]
      },
      {
        element: <PreRoute routerType={RouterType.Role} roles={[RoleType.Admin]} />,
        children: [
          {
            path: NavType.Users,
            element: <UsersHomePage />
          },
          {
            path: `${NavType.Users}${NavType.NotFound}`,
            element: <Navigate to={NavType.Users} replace />
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
