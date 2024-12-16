import { useState, useEffect, useCallback } from "react";
import { IonButton } from "@ionic/react";

export const InstallPWA = () => {
  const [beforeInstallEvent, setBeforeInstallEvent] = useState<any | undefined>(undefined);
  const [installingViaButton, setInstallingViaButton] = useState(false);

  const onBeforeInstallPromptEvent = useCallback((event: any) => {
    event.preventDefault();
    setBeforeInstallEvent(event);
  }, []);

  const onInstallClick = useCallback(async () => {
    if (!beforeInstallEvent) return;
    setInstallingViaButton(true);
    beforeInstallEvent.prompt();
    const { outcome } = await beforeInstallEvent.userChoice;
    if (outcome === "dismissed") setInstallingViaButton(false);
  }, [beforeInstallEvent]);

  const onAppInstalled = useCallback(() => {
    setBeforeInstallEvent(undefined);
    if (document.hidden) return;
    setInstallingViaButton(false);
  }, [installingViaButton]);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", onBeforeInstallPromptEvent);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPromptEvent);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [onBeforeInstallPromptEvent, onAppInstalled]);

  return (
    <>
      {beforeInstallEvent && (
        <IonButton color="warning" onClick={onInstallClick}>
          Install
        </IonButton>
      )}
    </>
  );
};
