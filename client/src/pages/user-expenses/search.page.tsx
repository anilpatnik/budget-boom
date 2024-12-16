import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { convertoISO, dateY90, dateT90 } from "@/util";
import { IExpenseSearch, IProject } from "@/models";
import { getCategories } from "@/services";
import { DateComponent, SelectComponent, AutoSelectComponent, Icon } from "@/components";

type ComponentProps = {
  search?: IExpenseSearch;
  projects?: IProject[];
  handleClose: () => void;
  handleSearch: (item?: any) => void;
};
export function ExpenseSearchPage({ search, projects, handleClose, handleSearch }: ComponentProps) {
  const formik = useFormik({
    initialValues: {
      startDate: search?.startDate || dateY90,
      endDate: search?.endDate || dateT90,
      projectId: search?.projectId || String.empty,
      categoryId: search?.categoryId || String.empty
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
        startDate: values?.startDate,
        endDate: values?.endDate,
        projectId: values?.projectId,
        categoryId: values?.categoryId
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
        <form>
          <div className="my-6 flex items-center">
            <div>
              <DateComponent
                name="startDate"
                label="Start Date"
                value={convertoISO(formik.values.startDate)}
                touched={formik.touched.startDate}
                errorMessage={formik.errors.startDate}
                handleChange={e => formik.setFieldValue("startDate", e.target.value || dateY90)}
              />
            </div>
            <div className="ml-5">
              <DateComponent
                name="endDate"
                label="End Date"
                value={convertoISO(formik.values.endDate)}
                touched={formik.touched.endDate}
                errorMessage={formik.errors.endDate}
                handleChange={e => formik.setFieldValue("endDate", e.target.value || dateT90)}
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
            <AutoSelectComponent
              name="projectId"
              label="Project"
              optional={true}
              value={formik.values.projectId}
              touched={formik.touched.projectId}
              errorMessage={formik.errors.projectId}
              handleChange={value => formik.setFieldValue("projectId", value)}
              payload={projects || []}
            />
          </div>
          <div className="my-6">
            <IonButton
              id="id-submit-button"
              size="small"
              color="secondary"
              onClick={() => formik.handleSubmit()}
              onDoubleClick={() => handleClose()}>
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
                    startDate: dateY90,
                    endDate: dateT90,
                    projectId: String.empty,
                    categoryId: String.empty
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
