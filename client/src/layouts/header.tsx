import { useNavigate } from "react-router-dom";
import { IonButton, IonButtons, IonHeader, IonIcon, IonToolbar, isPlatform } from "@ionic/react";
import {
  cashOutline,
  libraryOutline,
  lockClosedOutline,
  peopleOutline,
  personOutline
} from "ionicons/icons";
import { Box, Toolbar, Avatar, AppBar } from "@mui/material";
import { NavType, RoleType, constants, isIOS } from "@/util";
import { useStore } from "@/contexts";

export function Header() {
  const { user } = useStore();
  const navigate = useNavigate();
  const handleMenuClick = (url: string) => navigate(url);
  return (
    <IonHeader
      className={
        isPlatform("mobile") || isPlatform("mobileweb")
          ? "border-0 shadow-none"
          : "p-5 border-0 shadow-none"
      }>
      <IonToolbar>
        <AppBar
          position="static"
          color="inherit"
          className={
            isPlatform("mobile") || isPlatform("mobileweb")
              ? "p-2 border-0 shadow-none"
              : "border-0 shadow-none"
          }>
          <Toolbar>
            {/* Logo */}
            <Box
              sx={{
                flexGrow: 1,
                marginLeft: `${user.auth ? "3.5em" : "0"}`,
                marginRight: `${user.auth ? "0" : "1.5em"}`
              }}
              className="ion-hide-md-up ion-text-center">
              <img
                alt={String.empty}
                src={constants.LOGO_IMG}
                height={constants.LOGO_HEIGHT}
                loading="lazy"
                className="cursor-pointer"
                onClick={() => handleMenuClick(NavType.Root)}
              />
            </Box>
            {user?.auth && (
              <>
                {/* Logo */}
                <Box sx={{ flexGrow: 0 }} className="ion-hide-md-down">
                  <img
                    alt={String.empty}
                    src={constants.LOGO_IMG}
                    height={constants.LOGO_HEIGHT}
                    loading="lazy"
                    className="cursor-pointer"
                    onClick={() => handleMenuClick(NavType.Root)}
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
