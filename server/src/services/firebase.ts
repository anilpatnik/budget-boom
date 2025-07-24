import { CreateRequest, firebaseAuth, UpdateRequest } from "../providers";
import { IToken } from "../models";
import { RoleType } from "../utils/enums";

export async function createToken(token: IToken) {
  return await firebaseAuth.setCustomUserClaims(token.uid || String.empty, {
    id: token.id || String.empty,
    role: token.role || RoleType.User
  });
}

export async function verifyToken(token: string) {
  return await firebaseAuth.verifyIdToken(token);
}

export async function getAuthUser(uid: string) {
  return await firebaseAuth.getUser(uid);
}

export async function createAuthUser(payload: CreateRequest) {
  return await firebaseAuth.createUser(payload);
}

export async function updateAuthUser(uid: string, payload: UpdateRequest) {
  return await firebaseAuth.updateUser(uid, payload);
}

export async function deleteAuthUser(uid: string) {
  return await firebaseAuth.deleteUser(uid);
}
