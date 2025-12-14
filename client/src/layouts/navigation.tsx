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
import { Footer, Header, TabMenu } from "@/layouts";
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

  const roleAllowed = !roles || roles.includes(user?.role ?? RoleType.User);
  const isAuth = user?.auth || false;

  useEffect(() => {
    if (!isAuth && (routerType === RouterType.User || routerType === RouterType.Role)) {
      // custom login disabled
      // navigate(NavType.SignIn, { replace: true, state: location.pathname });
      navigate(NavType.Root, { replace: true });
    } else if (isAuth && routerType === RouterType.Auth) {
      navigate(NavType.Root, { replace: true });
    } else if (isAuth && routerType === RouterType.Role && !roleAllowed) {
      navigate(NavType.Root, { replace: true });
    }
  }, [isAuth, routerType, roleAllowed, location.pathname, navigate]);

  return children || <Outlet />;
}

type Props = {
  header?: boolean;
  footer?: boolean;
  tabMenu?: boolean;
  toast?: boolean;
  preRoute?: boolean;
  routerType?: RouterType;
  roles?: RoleType[];
  children?: any;
};
function AppLayout({
  header = false,
  footer = false,
  tabMenu = false,
  toast = false,
  preRoute = false,
  routerType,
  roles,
  children
}: Props) {
  return (
    <StoreProvider>
      <IonPage>
        {header && <Header />}
        <IonContent className="custom-content">
          <div className={tabMenu ? "pb-16" : ""}>
            {preRoute ? (
              <PreRoute routerType={routerType} roles={roles}>
                {children}
              </PreRoute>
            ) : (
              <Outlet />
            )}
          </div>
        </IonContent>
        {footer && <Footer />}
        {tabMenu && <TabMenu />}
        {toast && <ToastContainer />}
      </IonPage>
    </StoreProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: NavType.Root,
    element: <AppLayout />,
    children: [
      { path: NavType.Root, element: <RootPage /> },
      { path: NavType.Home, element: <HomePage /> },
      { path: NavType.PrivacyPolicy, element: <PrivacyPolicy /> },
      { path: NavType.TermsConditions, element: <TermsConditions /> },
      { path: "*", element: <RootPage /> }
    ]
  },
  {
    path: NavType.Root,
    element: <AppLayout header footer toast preRoute routerType={RouterType.Auth} />,
    children: [
      { path: NavType.SignIn, element: <SignInPage /> },
      { path: NavType.SignUp, element: <SignUpPage /> },
      { path: NavType.ForgotPassword, element: <ForgotPasswordPage /> },
      { path: NavType.Callback, element: <CallbackPage /> },
      { path: `${NavType.VerifyEmail}/:${constants.ACTION_CODE}`, element: <VerifyEmailPage /> },
      { path: `${NavType.ResetPassword}/:${constants.ACTION_CODE}`, element: <ResetPasswordPage /> }
    ]
  },
  {
    path: NavType.Root,
    element: (
      <AppLayout
        header
        tabMenu
        toast
        preRoute
        routerType={RouterType.User}
        roles={[RoleType.User, RoleType.Admin]}
      />
    ),
    children: [
      { path: NavType.Profile, element: <ProfileHomePage /> },
      { path: NavType.SignOut, element: <SignOutPage /> }
    ]
  },
  {
    path: NavType.Root,
    element: (
      <AppLayout
        header
        tabMenu
        toast
        preRoute
        routerType={RouterType.User}
        roles={[RoleType.User]}
      />
    ),
    children: [
      { path: NavType.Expenses, element: <ExpensesHomePage /> },
      { path: NavType.Projects, element: <ProjectsHomePage /> },
      { path: NavType.Report, element: <ExpensesHomePage /> }
    ]
  },
  {
    path: NavType.Root,
    element: (
      <AppLayout
        header
        tabMenu
        toast
        preRoute
        routerType={RouterType.Role}
        roles={[RoleType.Admin]}
      />
    ),
    children: [{ path: NavType.Users, element: <UsersHomePage /> }]
  }
]);
