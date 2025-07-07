import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react";
import { ToastContainer } from "react-toastify";
import { NavType, RoleType, RouterType, constants } from "@/util";
import { StoreProvider, useStore } from "@/contexts";
import {
  RootPage,
  CallbackPage,
  SignInPage,
  SignOutPage,
  SignUpPage,
  ForgotPasswordPage,
  VerifyEmailPage,
  ResetPasswordPage,
  ProfileHomePage,
  UsersHomePage,
  ProjectsHomePage,
  ExpensesHomePage
} from "@/pages";
import { Header } from "./header";
// import { Footer } from "./footer";
import { TabMenu } from "./tab.menu";
import { PrivacyPolicyPage, TermsConditionsPage } from "@/legal";

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
    return (window.location.href = NavType.Root);
  } else if (user?.auth && routerType === RouterType.Role && !isAllowed) {
    return (window.location.href = NavType.Root);
  } else {
    return children ? children : <Outlet />;
  }
}

function TabLayout() {
  return (
    <StoreProvider>
      <IonPage id="main-content">
        {location.pathname !== NavType.Root && <Header />}
        <TabMenu>
          <IonRouterOutlet>
            <IonContent
              className={(location.pathname !== NavType.Root && "custom-content") || String.empty}>
              <Outlet />
            </IonContent>
          </IonRouterOutlet>
        </TabMenu>
        {/* location.pathname !== NavType.Root && <Footer /> */}
        <ToastContainer />
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
          },
          {
            path: NavType.SignOut,
            element: <SignOutPage />
          }
        ]
      },
      {
        element: <PreRoute routerType={RouterType.User} roles={[RoleType.User]} />,
        children: [
          {
            path: NavType.Expenses,
            element: <ExpensesHomePage />
          }
        ]
      },
      {
        element: <PreRoute routerType={RouterType.User} roles={[RoleType.User]} />,
        children: [
          {
            path: NavType.Report,
            element: <ExpensesHomePage />
          }
        ]
      },
      {
        element: <PreRoute routerType={RouterType.User} roles={[RoleType.User]} />,
        children: [
          {
            path: NavType.Projects,
            element: <ProjectsHomePage />
          }
        ]
      },
      {
        element: <PreRoute routerType={RouterType.Role} roles={[RoleType.Admin]} />,
        children: [
          {
            path: NavType.Users,
            element: <UsersHomePage />
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
