import { useEffect } from "react";
import { Outlet, createBrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import { ToastContainer } from "react-toastify";
import { constants } from "@/utils";
import { NavType, RoleType, RouterType } from "@/utils/enums";
import { StoreProvider, useStore } from "@/contexts";
import {
  RootPage,
  HomePage,
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
import { Header, TabMenu } from "@/layouts";
import { PrivacyPolicy, TermsConditions } from "@/legal";

function PreRoute({
  children,
  routerType,
  roles
}: {
  children?: any;
  routerType?: RouterType;
  roles?: RoleType[];
}) {
  const { user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isAllowed = roles && roles.length > 0 && roles.includes(user?.role ?? RoleType.User);

  useEffect(() => {
    if (!user?.auth && (routerType === RouterType.User || routerType === RouterType.Role)) {
      navigate(NavType.SignIn, { replace: true, state: location.pathname });
    } else if (user?.auth && routerType === RouterType.Auth) {
      navigate(NavType.Root, { replace: true });
    } else if (user?.auth && routerType === RouterType.Role && !isAllowed) {
      navigate(NavType.Root, { replace: true });
    }
  }, [user?.auth, routerType, isAllowed, location.pathname, navigate]);

  return children ? children : <Outlet />;
}

function TabLayout() {
  return (
    <StoreProvider>
      <IonPage>
        <Header />
        <IonContent className="custom-content">
          <div className="pb-16">
            <Outlet />
          </div>
        </IonContent>
        <TabMenu />
        <ToastContainer />
      </IonPage>
    </StoreProvider>
  );
}

function RootLayout() {
  return (
    <StoreProvider>
      <IonPage>
        <IonContent>
          <Outlet />
        </IonContent>
      </IonPage>
    </StoreProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: NavType.Root,
    element: <RootLayout />,
    children: [
      {
        index: true,
        path: NavType.Root,
        element: <RootPage />
      },
      {
        path: NavType.Home,
        element: <HomePage />
      }
    ]
  },
  {
    path: NavType.Root,
    element: <TabLayout />,
    children: [
      {
        path: NavType.PrivacyPolicy,
        element: <PrivacyPolicy />
      },
      {
        path: NavType.TermsConditions,
        element: <TermsConditions />
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
