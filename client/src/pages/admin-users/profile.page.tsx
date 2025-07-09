import { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonToolbar
} from "@ionic/react";
import { Avatar, FormControl, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { constants, helper } from "@/utils";
import { AuthType, RoleType } from "@/utils/enums";
import { IAdminUser } from "@/models";
import { userService } from "@/services";
import { InputField, PasswordField, Icon } from "@/components";

type Props = {
  user?: IAdminUser;
  handleClose: () => void;
  handleNew: (item?: any) => void;
  handleEdit: (item?: any) => void;
};
export function UserProfilePage({ user, handleClose, handleNew, handleEdit }: Props) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: user?.name ?? String.empty,
      email: user?.email ?? String.empty,
      password: user?.password ?? String.empty,
      emailVerified: user?.emailVerified || false,
      disabled: !user?.disabled || false,
      role: user?.role || RoleType.User,
      photo: user?.photo || String.empty,
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
        const res = await userService.updateUserAsync(newUser);
        if (res && !res?.success) {
          helper.toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
          setLoading(false);
          return;
        } else {
          helper.toastify("Created Successfully", constants.SUCCESS, constants.SUCCESS_DELAY);
          setTimeout(() => {
            const xUser = { ...newUser, uid: res?.resource };
            handleNew(xUser);
            setLoading(false);
          }, constants.DELAY);
        }
      } else {
        const updateUser: IAdminUser = {
          uid: user?.uid,
          name: values?.name,
          role: values?.role,
          emailVerified: values?.emailVerified,
          disabled: !values?.disabled
        };
        const res = await userService.updateUserAsync(updateUser);
        if (res && !res?.success) {
          helper.toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
          setLoading(false);
          return;
        } else {
          helper.toastify("Updated Successfully", constants.SUCCESS, constants.SUCCESS_DELAY);
          setTimeout(() => {
            const xUser = { ...updateUser, email: user?.email, uid: res?.resource };
            handleEdit(xUser);
            setLoading(false);
          }, constants.DELAY);
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
        <form onSubmit={formik.handleSubmit}>
          <Avatar
            className="profile-pic-center"
            sx={{ width: 80, height: 80 }}
            src={formik.values.photo}
          />
          <div className="my-6">
            <InputField
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
                <InputField
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
                <PasswordField
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
              {!helper.externaLogin(formik.values.providers) && (
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
                      {x === AuthType.Email && <Icon name="mail-outline" />}
                      {x === AuthType.Google && <Icon name="logo-google" />}
                      {x === AuthType.Facebook && <Icon name="logo-facebook" />}
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
              type="submit"
              disabled={loading}>
              {loading ? (
                <Icon name="sync-sharp" css="icon-spinner" slot="start" />
              ) : (
                <Icon name="caret-forward-sharp" slot="start" />
              )}
              SUBMIT
            </IonButton>
            <IonButton
              size="small"
              color="light"
              className="ml-5"
              onClick={formik.handleReset}
              onDoubleClick={() => handleClose()}>
              <Icon name="refresh-sharp" slot="start" />
              RESET
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
}
