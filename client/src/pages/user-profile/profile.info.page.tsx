import { useState } from "react";
import { IonButton, IonIcon, IonSpinner, useIonToast } from "@ionic/react";
import { caretForwardOutline, refreshOutline } from "ionicons/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useStore } from "@/contexts";
import { countries, updateProfileInfo } from "@/services";
import { InputComponent, SelectComponent } from "@/components";

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
        color: "danger",
        duration: 5000
      });
    } else {
      setAuth(prev => ({ ...prev, name, countryId }));
    }
    setTimeout(() => setLoading(false), 200);
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
          payload={countries || []}
        />
      </div>
      <IonButton
        id="id-submit-button"
        size="small"
        type="submit"
        aria-hidden="false"
        className="ion-margin-vertical"
        disabled={loading}>
        <button type="submit" hidden />
        {loading ? (
          <IonSpinner name="lines-sharp-small"></IonSpinner>
        ) : (
          <IonIcon slot="start" icon={caretForwardOutline} />
        )}
        SUBMIT
      </IonButton>
      <IonButton
        className="ion-margin-horizontal"
        size="small"
        color="light"
        aria-hidden="false"
        onClick={formik.handleReset}>
        <IonIcon icon={refreshOutline} slot="start" />
        RESET
      </IonButton>
    </form>
  );
}
