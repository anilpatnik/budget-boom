import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import { LazyLoading } from "@/components";
import { NavType, PageType, CrudType } from "@/util";
import { AdminUser, IAdminUser } from "@/models";
import { UserProfilePage } from "./profile.page";
import { UsersPage } from "./users.page";

type userState = {
  pageType: PageType;
  searchType?: number;
  searchInput?: string;
  user?: IAdminUser;
};
const userStateInit: userState = {
  pageType: PageType.Default,
  searchType: 10,
  searchInput: String.empty,
  user: AdminUser
};
export function UsersHomePage() {
  const [userState, setUserState] = useState(userStateInit);
  const navigate = useNavigate();
  const handleClick = (
    pageType: PageType,
    searchType?: number,
    searchInput?: string,
    user?: IAdminUser
  ) => {
    if (pageType === PageType.Default) {
      setUserState(prev => ({ ...prev, pageType, searchType, searchInput, user: AdminUser }));
    } else {
      setUserState(prev => ({ ...prev, pageType, searchType, searchInput, user }));
    }
  };
  return (
    <>
      <IonBreadcrumbs className="ion-margin-vertical">
        <IonBreadcrumb onClick={() => navigate(NavType.Root)} className="cursor-pointer">
          <IonIcon slot="separator" icon={caretForwardOutline} />
          Home
        </IonBreadcrumb>
        <IonBreadcrumb
          onClick={() => navigate(`${NavType.Users}${NavType.NotFound}`)}
          className="cursor-pointer">
          <IonIcon slot="separator" icon={caretForwardOutline} />
          Users
        </IonBreadcrumb>
        {userState.user?.type !== CrudType.Read && (
          <IonBreadcrumb>
            <IonIcon slot="separator" /> {userState.user?.email || "New User"}
          </IonBreadcrumb>
        )}
      </IonBreadcrumbs>
      {userState.pageType === PageType.Step1 && (
        <LazyLoading>
          <UserProfilePage
            user={userState.user}
            searchType={userState.searchType}
            searchInput={userState.searchInput}
            handleClick={handleClick}
          />
        </LazyLoading>
      )}
      {userState.pageType === PageType.Default && (
        <UsersPage
          searchType={userState.searchType}
          searchInput={userState.searchInput}
          handleClick={handleClick}
        />
      )}
    </>
  );
}
