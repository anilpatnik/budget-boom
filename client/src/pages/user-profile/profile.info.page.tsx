import { useState } from "react";
import { IonButton, useIonToast } from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useStore } from "@/contexts";
import { getCountries, getCountry, updateProfileInfo } from "@/services";
import { Icon, InputComponent, SelectComponent } from "@/components";
import { constants } from "@/util";

export function ProfileInfoPage() {
  const { user, setAuth } = useStore();
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const formik = useFormik({
    initialValues: {
      name: user?.name || String.empty,
      countryId: user?.countryId || String.empty
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      name: Yup.string().required("required")
    }),
    onSubmit: values => handleSubmit(values?.name, values?.countryId)
  });

  const handleSubmit = async (name: string, countryId?: string) => {
    setLoading(true);
    const res = await updateProfileInfo(name, countryId);
    if (res && !res?.success) {
      present({
        message: res?.resource,
        color: constants.DANGER,
        duration: constants.FAILURE_DELAY
      });
      setLoading(false);
      return;
    } else {
      setAuth(prev => ({
        ...prev,
        name,
        countryId,
        currency: getCountry(countryId ?? navigator.language)?.code
      }));
      present({
        message: "Updated Successfully",
        color: constants.SUCCESS,
        duration: constants.SUCCESS_DELAY
      });
      setTimeout(() => {
        setLoading(false);
      }, constants.DELAY);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
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
      <div className="my-6">
        <SelectComponent
          name="countryId"
          label="Tax Country"
          value={formik.values.countryId}
          touched={formik.touched.countryId}
          errorMessage={formik.errors.countryId}
          handleChange={formik.handleChange}
          payload={getCountries() || []}
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
      <IonButton
        className="ion-margin-horizontal"
        size="small"
        color="light"
        onClick={formik.handleReset}>
        <Icon name="refresh-sharp" slot="start" />
        RESET
      </IonButton>
    </form>
  );
}
