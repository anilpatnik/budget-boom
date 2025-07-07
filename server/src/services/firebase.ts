import { CreateRequest, firebaseAuth, UpdateRequest } from "../providers";

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
