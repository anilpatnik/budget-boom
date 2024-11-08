import express, { Router } from "express";
import { lookup, auth, user, category, project, expense } from "../services";
import { authelper, RoleType } from "../util";

const apiRouter: Router = express.Router();

apiRouter.post("/signin", auth.signInAsync);
apiRouter.post("/captcha", auth.captchaVerifyAsync);

apiRouter.post("/profile", authelper.authorize(), auth.updateProfileAsync);
apiRouter.delete("/profile", authelper.authorize(), auth.deleteProfileAsync);

apiRouter.post("/users", authelper.authorize([RoleType.Admin]), user.getUsersAsync);
apiRouter.get("/users/:userid", authelper.authorize([RoleType.Admin]), user.getUserAsync);
apiRouter.post("/user", authelper.authorize([RoleType.Admin]), user.upsertUserAsync);
apiRouter.delete("/users/:userid", authelper.authorize([RoleType.Admin]), user.deleteUserAsync);

apiRouter.get("/pub/categories", authelper.authorize(), lookup.getPubCategoriesAsync);
apiRouter.get("/pub/projects", authelper.authorize(), lookup.getPubProjectsAsync);

apiRouter.get("/categories", authelper.authorize([RoleType.Admin]), category.getCategoriesAsync);
// prettier-ignore
apiRouter.get("/categories/:categoryid",authelper.authorize([RoleType.Admin]),category.getCategoryAsync);
apiRouter.post("/category", authelper.authorize([RoleType.Admin]), category.upsertCategoryAsync);
// prettier-ignore
apiRouter.delete("/categories/:categoryid", authelper.authorize([RoleType.Admin]), category.deleteCategoryAsync);

apiRouter.post("/projects", authelper.authorize(), project.getProjectsAsync);
apiRouter.get("/projects/:projectid", authelper.authorize(), project.getProjectAsync);
apiRouter.post("/project", authelper.authorize(), project.upsertProjectAsync);
apiRouter.delete("/projects/:projectid", authelper.authorize(), project.deleteProjectAsync);

apiRouter.post("/expenses", authelper.authorize(), expense.getExpensesAsync);
apiRouter.get("/expenses/:expenseid", authelper.authorize(), expense.getExpenseAsync);
apiRouter.post("/expense", authelper.authorize(), expense.upsertExpenseAsync);
apiRouter.delete("/expenses/:expenseid", authelper.authorize(), expense.deleteExpenseAsync);

export { apiRouter };
