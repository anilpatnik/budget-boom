import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonToolbar
} from "@ionic/react";
import { Switch } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { dateHelper } from "@/utils";
import { IExpenseSearch, IProject } from "@/models";
import { DateField, Icon, SelectField } from "@/components";

type Props = {
  search?: IExpenseSearch;
  projects?: IProject[];
  handleClose: () => void;
  handleSearch: (item?: any) => void;
};
export function ExpenseReportSearchPage({ search, projects, handleClose, handleSearch }: Props) {
  const formik = useFormik({
    initialValues: {
      startDate: search?.startDate || dateHelper.monthStart,
      endDate: search?.endDate || dateHelper.monthEnd,
      projectId: search?.projectId || String.empty,
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
              <DateField
                name="startDate"
                label="Start Date"
                value={dateHelper.convertoISO(formik.values.startDate)}
                touched={formik.touched.startDate}
                errorMessage={formik.errors.startDate}
                handleChange={e =>
                  formik.setFieldValue("startDate", e.target.value || dateHelper.monthStart)
                }
              />
            </div>
            <div className="ml-10">
              <DateField
                name="endDate"
                label="End Date"
                value={dateHelper.convertoISO(formik.values.endDate)}
                touched={formik.touched.endDate}
                errorMessage={formik.errors.endDate}
                handleChange={e =>
                  formik.setFieldValue("endDate", e.target.value || dateHelper.monthEnd)
                }
              />
            </div>
          </div>
          <div className="my-6">
            <SelectField
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
                    startDate: dateHelper.monthStart,
                    endDate: dateHelper.monthEnd,
                    projectId: String.empty,
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
