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
  RootUrl = "/",
  PrivacyPolicyUrl = "/privacy-policy",
  TermsConditionsUrl = "/terms-conditions",
  DisclaimerUrl = "/disclaimer",
  SignInUrl = "/signin",
  SignUpUrl = "/signup",
  VerifyEmailUrl = "/verify-email",
  ForgotPasswordUrl = "/forgot-password",
  ResetPasswordUrl = "/reset-password",
  CallbackUrl = "/callback",
  ProfileUrl = "/profile",
  UsersUrl = "/users",
  ProjectsUrl = "/projects",
  ExpensesUrl = "/expenses",
  NotFoundUrl = "/404"
}

export enum ServiceType {
  SignInUrl = "/signin",
  ProfileUrl = "/profile",
  CaptchaUrl = "/captcha",
  UsersUrl = "/users",
  UserUrl = "/user",
  CategoriesUrl = "/categories",
  Projects = "/projects",
  Project = "/project",
  Expenses = "/expenses",
  Expense = "/expense"
}
