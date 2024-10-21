import { useState } from "react";
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonLabel,
  IonRow,
  IonSpinner,
  useIonToast
} from "@ionic/react";
import {
  callOutline,
  caretBackOutline,
  caretForwardOutline,
  logoFacebook,
  logoGoogle,
  mailOutline,
  refreshOutline
} from "ionicons/icons";
import { FormControl, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthType, PageType, RoleType, constants, externaLogin } from "@/util";
import { IAdminUser } from "@/models";
import { updateUserAsync } from "@/services";
import { InputComponent, PasswordComponent } from "@/components";

type ComponentProps = {
  user?: IAdminUser;
  handleClick: (
    pageType: PageType,
    searchType?: number,
    searchInput?: string,
    user?: IAdminUser
  ) => void;
  searchType?: number;
  searchInput?: string;
};
export function UserProfilePage({ user, handleClick, searchType, searchInput }: ComponentProps) {
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
            color: "danger",
            duration: 5000
          });
        } else {
          present({
            message: "Created Successfully",
            color: "success",
            duration: 3000
          });
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
            color: "danger",
            duration: 5000
          });
        } else {
          present({
            message: "Updated Successfully",
            color: "success",
            duration: 3000
          });
        }
      }
      setTimeout(() => {
        setLoading(false);
        handleClick(PageType.Default, searchType, searchInput);
      }, 200);
    }
  });

  return (
    <IonGrid>
      <IonRow>
        <IonCol></IonCol>
        <IonCol size="12" size-md="6">
          <IonCard className="ion-padding-bottom">
            <IonCardContent>
              <form onSubmit={formik.handleSubmit}>
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
                <IonGrid>
                  <IonRow>
                    <IonCol size-md="3" size-sm="4">
                      <IonButton
                        id="id-submit-button"
                        size="small"
                        type="submit"
                        aria-hidden="false"
                        disabled={loading}>
                        <button type="submit" hidden />
                        {loading ? (
                          <IonSpinner name="lines-sharp-small"></IonSpinner>
                        ) : (
                          <IonIcon slot="start" icon={caretForwardOutline} />
                        )}
                        SUBMIT
                      </IonButton>
                    </IonCol>
                    <IonCol size-md="3" size-sm="4">
                      <IonButton
                        size="small"
                        color="light"
                        aria-hidden="false"
                        onClick={formik.handleReset}>
                        <IonIcon icon={refreshOutline} slot="start" />
                        RESET
                      </IonButton>
                    </IonCol>
                    <IonCol size-md="3" size-sm="4">
                      <IonButton
                        id="id-back-button"
                        size="small"
                        color="medium"
                        aria-hidden="false"
                        onClick={(e: any) =>
                          handleClick(PageType.Default, searchType, searchInput)
                        }>
                        <IonIcon icon={caretBackOutline} slot="start" />
                        BACK
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </form>
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol></IonCol>
      </IonRow>
    </IonGrid>
  );
}
