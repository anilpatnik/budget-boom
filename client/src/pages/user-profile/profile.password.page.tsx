import { useState } from "react";
import { IonButton } from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon, PasswordField, PasswordStrength } from "@/components";
import { authService } from "@/services";
import { constants, helper } from "@/utils";

export function ProfilePasswordPage() {
  const [loading, setLoading] = useState(false);

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
    const res = await authService.updateProfilePassword(password);
    if (res && !res?.success) {
      helper.toastify(res?.resource, constants.ERROR, constants.FAILURE_DELAY);
    } else {
      helper.toastify(
        "You have successfully changed your password",
        constants.SUCCESS,
        constants.SUCCESS_DELAY
      );
    }
    setTimeout(() => {
      formik.resetForm();
      setLoading(false);
    }, constants.DELAY);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="my-6">
        <PasswordField
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
        <PasswordField
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
