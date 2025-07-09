import { useNavigate } from "react-router-dom";
import { IonButton, IonButtons, IonHeader, IonIcon, IonToolbar, isPlatform } from "@ionic/react";
import {
  barChartOutline,
  cashOutline,
  libraryOutline,
  lockClosedOutline,
  peopleOutline,
  personOutline
} from "ionicons/icons";
import { Box, Toolbar, Avatar, AppBar } from "@mui/material";
import { constants } from "@/utils";
import { NavType, RoleType } from "@/utils/enums";
import { useStore } from "@/contexts";
import { InstallPWA } from "@/layouts";

export function Header() {
  const { user } = useStore();
  const navigate = useNavigate();
  const handleMenuClick = (url: string) => navigate(url);

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
              <a href={!user?.auth ? NavType.Root : String.empty}>
                <img
                  alt={String.empty}
                  src={constants.LOGO_IMG}
                  height="48px"
                  width="48px"
                  loading="lazy"
                  className="cursor-pointer"
                />
              </a>
            </Box>

            {/* Desktop ONLY - Authenticated */}
            {user?.auth && (
              <>
                {/* Logo */}
                <Box sx={{ flexGrow: 0 }} className="ion-hide-md-down">
                  <img
                    alt={String.empty}
                    src={constants.LOGO_IMG}
                    height="48px"
                    width="48px"
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
                        <IonIcon icon={peopleOutline} className="mr-2" /> Users
                      </IonButton>
                    )}
                    {/* Expenses */}
                    {user?.role === RoleType.User && (
                      <IonButton
                        id="id-expenses-menu"
                        size="small"
                        onClick={() => handleMenuClick(NavType.Expenses)}>
                        <IonIcon icon={cashOutline} className="mr-2" /> Expenses
                      </IonButton>
                    )}
                    {/* Projects */}
                    {user?.role === RoleType.User && (
                      <IonButton
                        id="id-projects-menu"
                        size="small"
                        onClick={() => handleMenuClick(NavType.Projects)}>
                        <IonIcon icon={libraryOutline} className="mr-2" /> Projects
                      </IonButton>
                    )}
                    {/* Report */}
                    {user?.role === RoleType.User && (
                      <IonButton
                        id="id-report-menu"
                        size="small"
                        onClick={() => handleMenuClick(NavType.Report)}>
                        <IonIcon icon={barChartOutline} className="mr-2" /> Report
                      </IonButton>
                    )}
                    {/* Profile */}
                    <IonButton
                      id="id-my-profile-menu"
                      size="small"
                      onClick={() => handleMenuClick(NavType.Profile)}>
                      <IonIcon icon={personOutline} className="mr-2" /> My Profile
                    </IonButton>
                    <IonButton
                      id="id-logoff-menu"
                      size="small"
                      onClick={() => handleMenuClick(NavType.SignOut)}>
                      <IonIcon icon={lockClosedOutline} className="mr-2" /> Logout
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
