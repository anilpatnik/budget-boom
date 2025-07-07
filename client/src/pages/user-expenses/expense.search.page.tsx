import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonToolbar
} from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { convertoISO, monthStart, monthEnd } from "@/util";
import { IExpenseSearch, IProject } from "@/models";
import { getCategories } from "@/services";
import { DateComponent, SelectComponent, Icon } from "@/components";
import { Switch } from "@mui/material";

type ComponentProps = {
  search?: IExpenseSearch;
  projects?: IProject[];
  handleClose: () => void;
  handleSearch: (item?: any) => void;
};
export function ExpenseSearchPage({ search, projects, handleClose, handleSearch }: ComponentProps) {
  const formik = useFormik({
    initialValues: {
      startDate: search?.startDate || monthStart,
      endDate: search?.endDate || monthEnd,
      projectId: search?.projectId || String.empty,
      categoryId: search?.categoryId || String.empty,
      skip: search?.skip || false
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      startDate: Yup.date().required("required"),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), "End Date should not be less than Start Date")
        .required("required")
    }),
    onSubmit: async values => {
      const search: IExpenseSearch = {
        startDate: values?.skip ? String.empty : values?.startDate,
        endDate: values?.skip ? String.empty : values?.endDate,
        projectId: values?.projectId,
        categoryId: values?.categoryId,
        skip: values?.skip
      };
      handleSearch(search);
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
          <div className="my-6 flex items-center">
            <div>
              <DateComponent
                name="startDate"
                label="Start Date"
                value={convertoISO(formik.values.startDate)}
                touched={formik.touched.startDate}
                errorMessage={formik.errors.startDate}
                handleChange={e => formik.setFieldValue("startDate", e.target.value || monthStart)}
              />
            </div>
            <div className="ml-10">
              <DateComponent
                name="endDate"
                label="End Date"
                value={convertoISO(formik.values.endDate)}
                touched={formik.touched.endDate}
                errorMessage={formik.errors.endDate}
                handleChange={e => formik.setFieldValue("endDate", e.target.value || monthEnd)}
              />
            </div>
          </div>
          <div className="my-6">
            <SelectComponent
              name="categoryId"
              label="Category"
              optional={true}
              value={formik.values.categoryId}
              touched={formik.touched.categoryId}
              errorMessage={formik.errors.categoryId}
              handleChange={formik.handleChange}
              payload={getCategories() || []}
            />
          </div>
          <div className="my-6">
            <SelectComponent
              name="projectId"
              label="Project"
              value={formik.values.projectId}
              optional={true}
              touched={formik.touched.projectId}
              errorMessage={formik.errors.projectId}
              handleChange={formik.handleChange}
              payload={projects || []}
            />
          </div>
          <div className="my-6">
            <IonLabel class="text-sm text-gray-700">Skip Date Range</IonLabel>
            <Switch
              id="skip"
              name="skip"
              checked={formik.values.skip}
              onChange={formik.handleChange}
            />
          </div>
          <div className="my-6">
            <IonButton id="id-submit-button" size="small" color="secondary" type="submit">
              <Icon name="search-sharp" slot="start" />
              SEARCH
            </IonButton>
            <IonButton
              size="small"
              color="light"
              className="ml-5"
              onClick={() =>
                formik.resetForm({
                  values: {
                    startDate: monthStart,
                    endDate: monthEnd,
                    projectId: String.empty,
                    categoryId: String.empty,
                    skip: false
                  }
                })
              }
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
