import express, { Router } from "express";
import { authCtrl, userCtrl, projectCtrl, expenseCtrl } from "../controllers";
import { authMiddleware } from "../middlewares";
import { RoleType } from "../utils/enums";

const apiRouter: Router = express.Router();

apiRouter.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

apiRouter.post("/signin", authCtrl.signInAsync);
apiRouter.post("/captcha", authCtrl.captchaVerifyAsync);

apiRouter.post("/profile", authMiddleware(), authCtrl.updateProfileAsync);
apiRouter.delete("/profile", authMiddleware(), authCtrl.deleteProfileAsync);

apiRouter.post("/users", authMiddleware([RoleType.Admin]), userCtrl.getUsersAsync);
apiRouter.get("/users/:userid", authMiddleware([RoleType.Admin]), userCtrl.getUserAsync);
apiRouter.post("/user", authMiddleware([RoleType.Admin]), userCtrl.upsertUserAsync);
apiRouter.delete("/users/:userid", authMiddleware([RoleType.Admin]), userCtrl.deleteUserAsync);

apiRouter.get("/projects/all", authMiddleware(), projectCtrl.getAllProjectsAsync);
apiRouter.post("/projects", authMiddleware(), projectCtrl.getProjectsAsync);
apiRouter.get("/projects/:projectid", authMiddleware(), projectCtrl.getProjectAsync);
apiRouter.post("/project", authMiddleware(), projectCtrl.upsertProjectAsync);
apiRouter.delete("/projects/:projectid", authMiddleware(), projectCtrl.deleteProjectAsync);

apiRouter.post("/expenses", authMiddleware(), expenseCtrl.getExpensesAsync);
apiRouter.get("/expenses/:expenseid", authMiddleware(), expenseCtrl.getExpenseAsync);
apiRouter.post("/expense", authMiddleware(), expenseCtrl.upsertExpenseAsync);
apiRouter.delete("/expenses/:expenseid", authMiddleware(), expenseCtrl.deleteExpenseAsync);
apiRouter.post("/expenses/report", authMiddleware(), expenseCtrl.getExpenseReportAsync);

export { apiRouter };
