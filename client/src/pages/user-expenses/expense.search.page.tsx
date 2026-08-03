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
import { dateHelper } from "@/utils";
import { IExpenseSearch, IProject } from "@/models";
import { lookupService } from "@/services";
import { DateField, SelectField, Icon } from "@/components";
import { Switch, FormControlLabel } from "@mui/material";

type Props = {
  search?: IExpenseSearch;
  projects?: IProject[];
  handleClose: () => void;
  handleSearch: (item?: any) => void;
};
export function ExpenseSearchPage({ search, projects, handleClose, handleSearch }: Props) {
  const formik = useFormik({
    initialValues: {
      startDate: search?.startDate || dateHelper.monthStart,
      endDate: search?.endDate || dateHelper.monthEnd,
      projectId: search?.projectId || String.empty,
      categoryId: search?.categoryId || String.empty,
      isTaxable: search?.isTaxable !== undefined ? search.isTaxable : undefined,
      skip: search?.skip ?? true
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      startDate: Yup.date().when("skip", {
        is: false,
        then: schema => schema.required("required")
      }),
      endDate: Yup.date().when("skip", {
        is: false,
        then: schema =>
          schema
            .min(Yup.ref("startDate"), "End Date should not be less than Start Date")
            .required("required")
      })
    }),
    onSubmit: async values => {
      const search: IExpenseSearch = {
        startDate: values?.skip ? String.empty : values?.startDate,
        endDate: values?.skip ? String.empty : values?.endDate,
        projectId: values?.projectId,
        categoryId: values?.categoryId,
        isTaxable: values?.isTaxable,
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
              name="categoryId"
              label="Category"
              optional={true}
              value={formik.values.categoryId}
              touched={formik.touched.categoryId}
              errorMessage={formik.errors.categoryId}
              handleChange={formik.handleChange}
              payload={lookupService.getCategories() || []}
            />
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
          <div className="my-6 flex items-center gap-6">
            <div className="flex-1">
              <IonLabel class="text-sm text-gray-700">Skip Date Range</IonLabel>
              <Switch
                id="skip"
                name="skip"
                checked={formik.values.skip}
                onChange={formik.handleChange}
              />
            </div>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isTaxable === true}
                  onChange={e => {
                    if (e.target.checked) {
                      formik.setFieldValue("isTaxable", true);
                    } else {
                      formik.setFieldValue("isTaxable", undefined);
                    }
                  }}
                  color="primary"
                />
              }
              label="Taxed"
            />
          </div>
          <div className="my-6">
            <IonButton id="id-submit-button" size="small" color="secondary" type="submit">
              <Icon name="search-sharp" slot="start" css="mr-1" />
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
                    categoryId: String.empty,
                    isTaxable: undefined,
                    skip: true
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
