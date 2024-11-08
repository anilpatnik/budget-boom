import { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSpinner,
  useIonToast
} from "@ionic/react";
import { caretBackOutline, caretForwardOutline, refreshOutline } from "ionicons/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CrudType, PageType } from "@/util";
import { ICategory } from "@/models";
import { upsertCategoryAsync } from "@/services";
import { InputComponent } from "@/components";

type ComponentProps = {
  category?: ICategory;
  handleClick: (pageType: PageType, category?: ICategory) => void;
};
export function CategoryPage({ category, handleClick }: ComponentProps) {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const formik = useFormik({
    initialValues: {
      name: category?.name || String.empty,
      icon: category?.icon || String.empty
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      name: Yup.string().required("required"),
      code: Yup.string().required("required"),
      icon: Yup.string().required("required")
    }),
    onSubmit: async values => {
      setLoading(true);
      if (category?.id?.length === 0) {
        const newCategory: ICategory = {
          id: crypto.randomUUID(),
          name: values?.name,
          icon: values?.icon,
          type: CrudType.Create
        };
        const res = await upsertCategoryAsync(newCategory);
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
        const updateCategory: ICategory = {
          id: category?.id,
          name: values?.name,
          icon: values?.icon,
          type: CrudType.Update
        };
        const res = await upsertCategoryAsync(updateCategory);
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
        handleClick(PageType.Default);
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
                  <InputComponent
                    name="icon"
                    label="Icon"
                    type="text"
                    value={formik.values.icon}
                    touched={formik.touched.icon}
                    errorMessage={formik.errors.icon}
                    handleChange={formik.handleChange}
                  />
                </div>
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
                        onClick={(e: any) => handleClick(PageType.Default)}>
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
