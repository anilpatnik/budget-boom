import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonButton,
  IonIcon,
  IonSpinner,
  IonThumbnail,
  useIonAlert,
  useIonToast
} from "@ionic/react";
import { caretForwardOutline, refreshOutline, trashOutline } from "ionicons/icons";
import { NavType, RoleType, ServiceType, constants, downloadFile, fb, uploadFile } from "@/util";
import { useStore } from "@/contexts";
import { deleteProfileAsync, updateProfilePic } from "@/services";
import { User } from "@/models";

export const ProfilePicturePage = () => {
  const { user, setAuth } = useStore();
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState(String.empty);
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();
  const navigate = useNavigate();

  const handleReset = (e: any) => setFile(undefined);
  const handleClick = (e: any) => inputFileRef?.current?.click();

  const handleUpload = (e: any) => {
    const inputFile = e.target.files[0];
    const preview = URL.createObjectURL(inputFile);
    setPreview(preview);
    setFile(inputFile);
  };

  const handleSubmit = async (e: any) => {
    if (file?.size) {
      setLoading(true);
      const imgFile = `${ServiceType.Users}/${fb.fAuth.currentUser?.uid}/profile.${file.name
        .split(".")
        .pop()}`;
      const snapshot = await uploadFile(file, imgFile);
      if (snapshot.state === constants.SUCCESS) {
        const imgUrl = await downloadFile(imgFile);
        if (imgUrl?.length > 5) {
          updateProfilePic(imgUrl).then(res => {
            if (res && !res?.success) {
              present({
                message: res?.resource,
                color: "danger",
                duration: 5000
              });
            } else {
              setAuth(prev => ({ ...prev, photo: imgUrl }));
            }
          });
        }
      }
      setTimeout(() => setLoading(false), 200);
    }
  };

  const handleUserDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteProfileAsync();
      if (res && !res?.success) {
        present({
          message: res?.resource,
          color: "danger",
          duration: 5000
        });
      } else {
        present({
          message: "Thank you for being with us 🙏 We're sad to see you go 😢",
          color: "success",
          duration: 3000
        });
        await handleLogout();
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const handleLogout = async () => {
    sessionStorage.clear();
    localStorage.clear();
    setAuth({ ...User });
    await fb.fSignOut();
    navigate(NavType.Root);
  };

  return (
    <>
      {user?.role === RoleType.User && (
        <div className="ion-text-center my-8">
          <IonButton
            id="id-delete-button"
            type="submit"
            color="danger"
            aria-hidden="false"
            onClick={() =>
              presentAlert({
                header: "Are you sure, you want to leave us?",
                buttons: [
                  { text: "Cancel" },
                  {
                    text: "Confirm",
                    handler: () => {
                      handleUserDelete();
                    }
                  }
                ]
              })
            }>
            {loading ? (
              <IonSpinner name="lines-sharp-small"></IonSpinner>
            ) : (
              <IonIcon slot="start" icon={trashOutline} />
            )}
            DELETE YOUR ACCOUNT
          </IonButton>
        </div>
      )}
      <input
        id="profile-pic-upload"
        name="profile-pic-upload"
        type="file"
        accept="image/*"
        className="profile-pic-input"
        onChange={handleUpload}
        ref={inputFileRef}
        title="upload profile pic"
      />
      <IonThumbnail className="profile-pic-img" onClick={handleClick}>
        <img
          src={file ? preview : user?.photo?.includes("https") ? user.photo : constants.STOCK_IMG}
          alt={file?.name}
          loading="lazy"
          onLoad={() => file && URL.revokeObjectURL(preview)}
        />
      </IonThumbnail>
      {!user.external && !file?.name && (
        <div className="ion-text-center my-8">
          Click on the image to upload a new profile picture
        </div>
      )}
      {!user.external && file?.name && (
        <div className="ion-text-center my-8">
          <IonButton
            id="id-upload-button"
            size="small"
            type="submit"
            aria-hidden="false"
            disabled={loading}
            onClick={handleSubmit}>
            {loading ? (
              <IonSpinner name="lines-sharp-small"></IonSpinner>
            ) : (
              <IonIcon slot="start" icon={caretForwardOutline} />
            )}
            UPLOAD
          </IonButton>
          <IonButton
            className="ion-margin-horizontal"
            size="small"
            color="light"
            aria-hidden="false"
            onClick={handleReset}>
            <IonIcon icon={refreshOutline} slot="start" />
            RESET
          </IonButton>
        </div>
      )}
    </>
  );
};
