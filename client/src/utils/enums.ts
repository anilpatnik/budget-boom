export enum RouterType {
  Auth = 10,
  User = 20,
  Role = 30
}

export enum AuthType {
  Email = "password",
  Google = "google",
  Facebook = "facebook"
}

export enum RoleType {
  User = 10,
  Admin = 20
}

export enum SearchType {
  Name = 10,
  Email = 20
}

export enum CrudType {
  Read = 10,
  Create = 20,
  Update = 30,
  Delete = 40
}

export enum AccordionType {
  Step1 = "10",
  Step2 = "20",
  Step3 = "30",
  Default = "100"
}

export enum PageType {
  Step1 = 0,
  Step2,
  Step3,
  Default
}

export enum NavType {
  Root = "/",
  Home = "/home",
  PrivacyPolicy = "/privacy-policy",
  TermsConditions = "/terms-of-use",
  SignIn = "/signin",
  SignOut = "/signout",
  SignUp = "/signup",
  VerifyEmail = "/verify-email",
  ForgotPassword = "/forgot-password",
  ResetPassword = "/reset-password",
  Callback = "/callback",
  Profile = "/profile",
  Users = "/users",
  Categories = "/categories",
  Projects = "/projects",
  Expenses = "/expenses",
  Report = "/report",
  NotFound = "/404"
}

export enum ServiceType {
  Pub = "/pub",
  SignIn = "/signin",
  Profile = "/profile",
  Captcha = "/captcha",
  Users = "/users",
  User = "/user",
  Categories = "/categories",
  Category = "/category",
  Projects = "/projects",
  Project = "/project",
  Expenses = "/expenses",
  Expense = "/expense",
  Report = "/report"
}
