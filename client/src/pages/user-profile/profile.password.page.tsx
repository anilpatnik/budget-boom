import { useState } from "react";
import { IonButton, useIonToast } from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon, PasswordComponent, PasswordStrength } from "@/components";
import { updateProfilePassword } from "@/services";
import { constants } from "@/util";

export function ProfilePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const formik = useFormik({
    initialValues: {
      password: String.empty,
      confirmpassword: String.empty
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      password: Yup.string().min(8).required("required"),
      confirmpassword: Yup.string()
        .min(8)
        .required("required")
        .when("password", {
          is: (val: string) => (val && val.length > 0 ? true : false),
          then: schema =>
            schema.oneOf([Yup.ref("password")], "confirm password does not match password")
        })
    }),
    onSubmit: values => {
      handleSubmit(values.password);
    }
  });

  const handleSubmit = async (password: string) => {
    setLoading(true);
    const res = await updateProfilePassword(password);
    if (res && !res?.success) {
      present({
        message: res?.resource,
        color: constants.DANGER,
        duration: 5000
      });
    } else {
      present({
        message: "You have successfully changed your password",
        color: constants.SUCCESS,
        duration: 3000
      });
    }
    setTimeout(() => {
      formik.resetForm();
      setLoading(false);
    }, 200);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="my-6">
        <PasswordComponent
          name="password"
          label="Password"
          value={formik.values.password}
          touched={formik.touched.password}
          errorMessage={formik.errors.password}
          handleChange={formik.handleChange}
        />
        <PasswordStrength password={formik.values.password} />
      </div>
      <div className="my-6">
        <PasswordComponent
          name="confirmpassword"
          label="Confirm Password"
          value={formik.values.confirmpassword}
          touched={formik.touched.confirmpassword}
          errorMessage={formik.errors.confirmpassword}
          handleChange={formik.handleChange}
        />
      </div>
      <IonButton
        id="id-submit-button"
        size="small"
        type="submit"
        className="ion-margin-vertical"
        disabled={loading}>
        <button type="submit" hidden />
        {loading ? (
          <Icon name="sync-sharp" css="icon-spinner" slot="start" />
        ) : (
          <Icon name="caret-forward-sharp" slot="start" />
        )}
        SUBMIT
      </IonButton>
    </form>
  );
}
