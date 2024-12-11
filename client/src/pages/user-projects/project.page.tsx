import { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonToolbar,
  useIonToast
} from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CrudType, constants, convertoISO, projectEnd, projectStart } from "@/util";
import { IProject } from "@/models";
import { upsertProjectAsync } from "@/services";
import { InputComponent, DateComponent, Icon } from "@/components";

type ComponentProps = {
  project?: IProject;
  handleClose: () => void;
  handleNew: (item?: any) => void;
  handleEdit: (item?: any) => void;
};
export function ProjectPage({ project, handleClose, handleNew, handleEdit }: ComponentProps) {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const formik = useFormik({
    initialValues: {
      name: project?.name || String.empty,
      budget: project?.budget || 0,
      startDate: project?.startDate || projectStart,
      endDate: project?.endDate || projectEnd
    },
    validateOnMount: false,
    validationSchema: Yup.object({
      name: Yup.string().required("required"),
      budget: Yup.number()
        .min(0, "budget should be zero or greater")
        .test("is-decimal", "budget should be two decimals", (val: any) => {
          if (val) return constants.TWO_DECIMAL_PATTERN.test(val);
          return true;
        })
        .notRequired(),
      startDate: Yup.date().notRequired(),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), "End date should not be less than Start date")
        .notRequired()
    }),
    onSubmit: async values => {
      setLoading(true);
      if (project?.id?.length === 0) {
        const newProject: IProject = {
          id: crypto.randomUUID(),
          name: values?.name,
          prevName: project?.prevName,
          budget: values?.budget,
          startDate: values?.startDate,
          endDate: values?.endDate,
          type: CrudType.Create
        };
        const res = await upsertProjectAsync(newProject);
        if (res && !res?.success) {
          present({
            message: res?.resource,
            color: constants.DANGER,
            duration: 5000
          });
          setLoading(false);
          return;
        } else {
          present({
            message: "Created Successfully",
            color: constants.SUCCESS,
            duration: 3000
          });
          setTimeout(() => {
            const xProject = { ...newProject, id: res?.resource?.id };
            handleNew(xProject);
            setLoading(false);
          }, 200);
        }
      } else {
        const updateProject: IProject = {
          id: project?.id,
          name: values?.name,
          prevName: project?.name,
          budget: values?.budget,
          startDate: values?.startDate,
          endDate: values?.endDate,
          type: CrudType.Update
        };
        const res = await upsertProjectAsync(updateProject);
        if (res && !res?.success) {
          present({
            message: res?.resource,
            color: constants.DANGER,
            duration: 5000
          });
          setLoading(false);
          return;
        } else {
          present({
            message: "Updated Successfully",
            color: constants.SUCCESS,
            duration: 3000
          });
          setTimeout(() => {
            handleEdit(updateProject);
            setLoading(false);
          }, 200);
        }
      }
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
              name="budget"
              label="Budget"
              type="number"
              startAdor={true}
              startAdorText="$"
              value={formik.values.budget.toString()}
              touched={formik.touched.budget}
              errorMessage={formik.errors.budget}
              handleChange={formik.handleChange}
              optional={true}
            />
          </div>
          <div className="my-6">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <DateComponent
                    name="startDate"
                    label="Start Date"
                    value={convertoISO(formik.values.startDate)}
                    optional={true}
                    touched={formik.touched.startDate}
                    errorMessage={formik.errors.startDate}
                    handleChange={e =>
                      formik.setFieldValue("startDate", e.target.value || projectStart)
                    }
                  />
                </IonCol>
                <IonCol>
                  <DateComponent
                    name="endDate"
                    label="End Date"
                    value={convertoISO(formik.values.endDate)}
                    optional={true}
                    touched={formik.touched.endDate}
                    errorMessage={formik.errors.endDate}
                    handleChange={e =>
                      formik.setFieldValue("endDate", e.target.value || projectEnd)
                    }
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
          <div className="my-6">
            <IonButton
              id="id-submit-button"
              size="small"
              color="secondary"
              onClick={() => formik.handleSubmit()}
              onDoubleClick={() => handleClose()}
              disabled={loading}>
              {loading ? (
                <Icon name="sync-sharp" css="icon-spinner" slot="start" />
              ) : (
                <Icon name="caret-forward-sharp" slot="start" />
              )}
              SUBMIT
            </IonButton>
            <IonButton
              size="small"
              color="light"
              className="ml-5"
              onClick={formik.handleReset}
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
