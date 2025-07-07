import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AccordionGroupCustomEvent,
  IonAccordion,
  IonAccordionGroup,
  IonBreadcrumb,
  IonBreadcrumbs,
  IonItem
} from "@ionic/react";
import { LazyLoading } from "@/components";
import { AccordionType, NavType } from "@/util";
import { useStore } from "@/contexts";
import { ProfileInfoPage } from "./profile.info.page";
import { ProfilePasswordPage } from "./profile.password.page";
import { ProfilePicturePage } from "./profile.picture.page";
import { Icon } from "@/components";

export function ProfileHomePage() {
  const navigate = useNavigate();
  const { user } = useStore();
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const [accordionValue, setAccordionValue] = useState(AccordionType.Default);

  const accordionGroupChange = (e: AccordionGroupCustomEvent) => {
    if (e.target.id === "profile-accordion") setAccordionValue(e.detail.value);
  };

  return (
    <>
      <IonBreadcrumbs className="ion-margin-vertical">
        <IonBreadcrumb className="cursor-pointer">
          <Icon name="caret-forward-outline" slot="separator" /> Home
        </IonBreadcrumb>
        <IonBreadcrumb>
          <Icon name="caret-forward-outline" slot="separator" /> Profile
        </IonBreadcrumb>
      </IonBreadcrumbs>
      <IonAccordionGroup
        expand="inset"
        ref={accordionGroup}
        value={accordionValue}
        onIonChange={accordionGroupChange}
        id="profile-accordion">
        <IonAccordion
          id="id-profile-picture-tab"
          value={AccordionType.Default}
          className="ion-margin-vertical">
          <IonItem slot="header" color="light">
            Profile Picture
          </IonItem>
          <div className="ion-padding" slot="content">
            {accordionValue === AccordionType.Default && (
              <LazyLoading>
                <ProfilePicturePage />
              </LazyLoading>
            )}
          </div>
        </IonAccordion>
        <IonAccordion
          id="id-profile-info-tab"
          value={AccordionType.Step1}
          className="ion-margin-vertical">
          <IonItem slot="header" color="light">
            Profile Info
          </IonItem>
          <div className="ion-padding" slot="content">
            {accordionValue === AccordionType.Step1 && (
              <LazyLoading>
                <ProfileInfoPage />
              </LazyLoading>
            )}
          </div>
        </IonAccordion>
        {!user.external && (
          <IonAccordion
            id="id-change-password-tab"
            value={AccordionType.Step2}
            className="ion-margin-vertical">
            <IonItem slot="header" color="light">
              Change Password
            </IonItem>
            <div className="ion-padding" slot="content">
              {accordionValue === AccordionType.Step2 && (
                <LazyLoading>
                  <ProfilePasswordPage />
                </LazyLoading>
              )}
            </div>
          </IonAccordion>
        )}
      </IonAccordionGroup>
    </>
  );
}
