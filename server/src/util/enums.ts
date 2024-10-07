export enum EnvType {
  Test = "development",
  Prod = "production"
}

export enum ResponseType {
  Unauthorised = "Unauthorized",
  TokenExpired = "Token Expired",
  TokenInvalid = "Token Invalid"
}

export enum CrudType {
  Read = 10,
  Create = 20,
  Update = 30,
  Delete = 40
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
