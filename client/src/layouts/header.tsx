import { useNavigate } from "react-router-dom";
import { IonButton, IonButtons, IonHeader, IonToolbar, isPlatform } from "@ionic/react";
import { Box, Toolbar, Avatar, AppBar } from "@mui/material";
import { constants } from "@/utils";
import { NavType, RoleType } from "@/utils/enums";
import { useStore } from "@/contexts";
import { InstallPWA } from "@/layouts";
import { Icon } from "@/components";

export function Header() {
  const { user } = useStore();
  const navigate = useNavigate();
  const handleMenuClick = (url: string) => navigate(url, { replace: true });

  return (
    <IonHeader
      style={
        isPlatform("mobile") || isPlatform("mobileweb")
          ? { border: 0, boxShadow: "none" }
          : { border: 0, boxShadow: "none" }
      }>
      <IonToolbar>
        <AppBar
          position="static"
          color="inherit"
          className={
            isPlatform("mobile") || isPlatform("mobileweb")
              ? "p-2 border-0 box-shadow-none"
              : "border-0 box-shadow-none"
          }>
          <Toolbar>
            {/* Mobile ONLY */}
            {/* PWA Install */}
            <Box className="ion-hide-md-up">
              <InstallPWA />
            </Box>

            {/* Mobile ONLY */}
            {/* Logo */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="ion-hide-md-up">
              {!user?.auth && (
                <a href={NavType.Root}>
                  <img
                    alt={String.empty}
                    src={constants.LOGO_IMG}
                    height="128px"
                    width="128px"
                    loading="lazy"
                    className="cursor-pointer"
                  />
                </a>
              )}
              {user?.auth && (
                <img
                  alt={String.empty}
                  src={constants.LOGO_IMG_2}
                  height="64px"
                  width="64px"
                  loading="lazy"
                />
              )}
            </Box>

            {/* Desktop ONLY - Authenticated */}
            {user?.auth && (
              <>
                {/* Logo */}
                <Box sx={{ flexGrow: 0 }} className="ion-hide-md-down">
                  <img
                    alt={String.empty}
                    src={constants.LOGO_IMG_2}
                    height="64px"
                    width="64px"
                    loading="lazy"
                  />
                </Box>
                {/* Left Nav Menu */}
                <Box sx={{ flexGrow: 1 }} className="ion-hide-md-down"></Box>
                {/* Right Nav Menu */}
                <Box sx={{ flexGrow: 0 }} className="ion-hide-md-down">
                  <IonButtons className="ion-margin-end">
                    {/* Users */}
                    {user?.role === RoleType.Admin && (
                      <IonButton
                        id="id-users-menu"
                        size="small"
                        onClick={() => handleMenuClick(NavType.Users)}>
                        <Icon name="people-outline" css="mr-2" /> Users
                      </IonButton>
                    )}
                    {/* Expenses */}
                    {user?.role === RoleType.User && (
                      <IonButton
                        id="id-expenses-menu"
                        size="small"
                        onClick={() => handleMenuClick(NavType.Expenses)}>
                        <Icon name="cash-outline" css="mr-2" />
                        Expenses
                      </IonButton>
                    )}
                    {/* Projects */}
                    {user?.role === RoleType.User && (
                      <IonButton
                        id="id-projects-menu"
                        size="small"
                        onClick={() => handleMenuClick(NavType.Projects)}>
                        <Icon name="library-outline" css="mr-2" /> Projects
                      </IonButton>
                    )}
                    {/* Report */}
                    {user?.role === RoleType.User && (
                      <IonButton
                        id="id-report-menu"
                        size="small"
                        onClick={() => handleMenuClick(NavType.Report)}>
                        <Icon name="bar-chart-outline" css="mr-2" /> Report
                      </IonButton>
                    )}
                    {/* Profile */}
                    <IonButton
                      id="id-my-profile-menu"
                      size="small"
                      onClick={() => handleMenuClick(NavType.Profile)}>
                      <Icon name="person-outline" css="mr-2" /> My Profile
                    </IonButton>
                    <IonButton
                      id="id-logoff-menu"
                      size="small"
                      onClick={() => handleMenuClick(NavType.SignOut)}>
                      <Icon name="lock-closed-outline" css="mr-2" /> Logout
                    </IonButton>
                  </IonButtons>
                </Box>
              </>
            )}

            {/* Desktop and Mobile - Authenticated */}
            {/* Avatar */}
            {user?.auth && (
              <Avatar
                id="id-my-profile-avatar"
                className="cursor-pointer"
                alt={user.name}
                src={user.photo ?? String.empty}
                onClick={() => handleMenuClick(NavType.Profile)}
              />
            )}
          </Toolbar>
        </AppBar>
      </IonToolbar>
    </IonHeader>
  );
}
