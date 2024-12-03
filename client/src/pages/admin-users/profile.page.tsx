import { useState } from "react";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSpinner,
  IonToolbar,
  useIonToast
} from "@ionic/react";
import {
  caretForwardOutline,
  logoFacebook,
  logoGoogle,
  mailOutline,
  refreshOutline
} from "ionicons/icons";
import { FormControl, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthType, RoleType, constants, externaLogin } from "@/util";
import { IAdminUser } from "@/models";
import { updateUserAsync } from "@/services";
import { InputComponent, PasswordComponent, Icon } from "@/components";

type ComponentProps = {
  user?: IAdminUser;
  handleClose: () => void;
  handleNew: (item?: any) => void;
  handleEdit: (item?: any) => void;
};
export function UserProfilePage({ user, handleClose, handleNew, handleEdit }: ComponentProps) {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const formik = useFormik({
    initialValues: {
      name: user?.name ?? String.empty,
      email: user?.email ?? String.empty,
      password: user?.password ?? String.empty,
      emailVerified: user?.emailVerified || false,
      disabled: !user?.disabled || false,
      role: user?.role || RoleType.User,
      photo: user?.photo || constants.STOCK_IMG,
      providers: user?.providers || []
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      name: Yup.string().required("required"),
      email: Yup.string().email("invalid email address").required("required"),
      password: Yup.string().min(8).required("required")
    }),
    onSubmit: async values => {
      setLoading(true);
      if (user?.uid?.length === 0) {
        const newUser: IAdminUser = {
          name: values?.name,
          email: values?.email,
          password: values?.password,
          role: values?.role
        };
        const res = await updateUserAsync(newUser);
        if (res && !res?.success) {
          present({
            message: res?.resource,
            color: constants.DANGER,
            duration: 5000
          });
          setLoading(false);
          return;
        } else {
          present({
            message: "Created Successfully",
            color: constants.SUCCESS,
            duration: 3000
          });
          setTimeout(() => {
            const updateUser = { ...newUser, uid: res?.resource };
            handleNew(updateUser);
            setLoading(false);
          }, 200);
        }
      } else {
        const updateUser: IAdminUser = {
          uid: user?.uid,
          name: values?.name,
          role: values?.role,
          emailVerified: values?.emailVerified,
          disabled: !values?.disabled
        };
        const res = await updateUserAsync(updateUser);
        if (res && !res?.success) {
          present({
            message: res?.resource,
            color: constants.DANGER,
            duration: 5000
          });
          setLoading(false);
          return;
        } else {
          present({
            message: "Updated Successfully",
            color: constants.SUCCESS,
            duration: 3000
          });
          setTimeout(() => {
            const newUser = { ...updateUser, email: user?.email, uid: res?.resource };
            handleEdit(newUser);
            setLoading(false);
          }, 200);
        }
      }
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              id="id-back-button"
              onClick={() => handleClose()}
              onDoubleClick={() => handleClose()}>
              <Icon name="caret-back-outline" />
              BACK
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form>
          <IonAvatar className="profile-pic-center">
            <img alt={formik.values.name} src={formik.values.photo} loading="lazy" />
          </IonAvatar>
          <div className="my-6">
            <InputComponent
              name="name"
              label="Name"
              type="text"
              value={formik.values.name}
              touched={formik.touched.name}
              errorMessage={formik.errors.name}
              handleChange={formik.handleChange}
            />
          </div>
          {user?.uid?.length === 0 && (
            <>
              <div className="my-6">
                <InputComponent
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  touched={formik.touched.email}
                  errorMessage={formik.errors.email}
                  handleChange={formik.handleChange}
                />
              </div>
              <div className="my-6">
                <PasswordComponent
                  name="password"
                  label="Password"
                  value={formik.values.password}
                  touched={formik.touched.password}
                  errorMessage={formik.errors.password}
                  handleChange={formik.handleChange}
                />
              </div>
            </>
          )}
          <div className="my-6">
            <FormControl fullWidth>
              <InputLabel shrink={true} variant="standard" id="role-label">
                Role
              </InputLabel>
              <Select
                sx={{
                  fontSize: "0.975em",
                  letterSpacing: "0.075em"
                }}
                id="role"
                name="role"
                value={formik.values.role}
                labelId="role-label"
                onChange={formik.handleChange}
                variant="standard">
                <MenuItem value={RoleType.User}>User</MenuItem>
                <MenuItem value={RoleType.Admin}>Admin</MenuItem>
              </Select>
            </FormControl>
          </div>
          {user?.uid?.length !== 0 && (
            <>
              {!externaLogin(formik.values.providers) && (
                <div className="ion-margin-vertical">
                  <IonLabel>Email Verified</IonLabel>
                  <Switch
                    id="emailVerified"
                    name="emailVerified"
                    checked={formik.values.emailVerified}
                    onChange={formik.handleChange}
                  />
                </div>
              )}
              <div className="ion-margin-vertical">
                <IonLabel>Active</IonLabel>
                <Switch
                  id="disabled"
                  name="disabled"
                  checked={formik.values.disabled}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.values.providers?.length !== 0 && (
                <div className="ion-margin-vertical">
                  <IonLabel>Login With</IonLabel>
                  {formik.values.providers?.map((x: AuthType, index: number) => (
                    <span key={index} className="ion-padding-start">
                      {x === AuthType.Email && <IonIcon icon={mailOutline} />}
                      {x === AuthType.Google && <IonIcon icon={logoGoogle} />}
                      {x === AuthType.Facebook && <IonIcon icon={logoFacebook} />}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
          <div className="my-6">
            <IonButton
              id="id-submit-button"
              size="small"
              color="secondary"
              onClick={() => formik.handleSubmit()}
              onDoubleClick={() => handleClose()}
              disabled={loading}>
              {loading ? (
                <IonSpinner name="lines-sharp-small"></IonSpinner>
              ) : (
                <IonIcon slot="start" icon={caretForwardOutline} />
              )}
              SUBMIT
            </IonButton>
            <IonButton
              size="small"
              color="light"
              className="ml-5"
              onClick={formik.handleReset}
              onDoubleClick={() => handleClose()}>
              <IonIcon slot="start" icon={refreshOutline} />
              RESET
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
}
