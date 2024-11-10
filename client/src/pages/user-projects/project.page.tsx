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
import { CrudType, PageType, constants, convertoISO, projectEnd, projectStart } from "@/util";
import { IProject } from "@/models";
import { upsertProjectAsync } from "@/services";
import { InputComponent, DateComponent } from "@/components";

type ComponentProps = {
  project?: IProject;
  handleClick: (pageType: PageType, project?: IProject) => void;
};
export function ProjectPage({ project, handleClick }: ComponentProps) {
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
            color: "danger",
            duration: 5000
          });
          setLoading(false);
          return;
        } else {
          present({
            message: "Created Successfully",
            color: "success",
            duration: 3000
          });
        }
      } else {
        const updateProject: IProject = {
          id: project?.id,
          name: values?.name,
          prevName: project?.prevName,
          budget: values?.budget,
          startDate: values?.startDate,
          endDate: values?.endDate,
          type: CrudType.Update
        };
        const res = await upsertProjectAsync(updateProject);
        if (res && !res?.success) {
          present({
            message: res?.resource,
            color: "danger",
            duration: 5000
          });
          setLoading(false);
          return;
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
