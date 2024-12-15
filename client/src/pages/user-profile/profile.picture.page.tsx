import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IonButton, IonThumbnail, useIonAlert, useIonToast } from "@ionic/react";
import { NavType, RoleType, ServiceType, constants, downloadFile, fb, uploadFile } from "@/util";
import { useStore } from "@/contexts";
import { deleteProfileAsync, updateProfilePic } from "@/services";
import { Icon } from "@/components";

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
                color: constants.DANGER,
                duration: constants.FAILURE_DELAY
              });
            } else {
              setAuth(prev => ({ ...prev, photo: imgUrl }));
            }
          });
        }
      }
      setTimeout(() => setLoading(false), constants.DELAY);
    }
  };

  const handleUserDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteProfileAsync();
      if (res && !res?.success) {
        present({
          message: res?.resource,
          color: constants.DANGER,
          duration: constants.FAILURE_DELAY
        });
      } else {
        present({
          message: "Thank you for being with us 🙏 We're sad to see you go 😢",
          color: constants.SUCCESS,
          duration: constants.SUCCESS_DELAY
        });
        navigate(NavType.SignOut);
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, constants.DELAY);
    }
  };

  return (
    <>
      {user?.role === RoleType.User && (
        <div className="ion-text-center my-8">
          <IonButton
            id="id-delete-button"
            type="submit"
            color="danger"
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
              <Icon name="sync-sharp" css="icon-spinner" slot="start" />
            ) : (
              <Icon name="trash-bin-sharp" slot="start" />
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
          src={file ? preview : user?.photo?.includes("https") ? user.photo : constants.PROFILE_IMG}
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
            disabled={loading}
            onClick={handleSubmit}>
            {loading ? (
              <Icon name="sync-sharp" css="icon-spinner" slot="start" />
            ) : (
              <Icon name="caret-forward-sharp" slot="start" />
            )}
            UPLOAD
          </IonButton>
          <IonButton
            className="ion-margin-horizontal"
            size="small"
            color="light"
            onClick={handleReset}>
            <Icon name="refresh-sharp" slot="start" />
            RESET
          </IonButton>
        </div>
      )}
    </>
  );
};
