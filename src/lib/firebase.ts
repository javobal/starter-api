import * as admin from "firebase-admin";

export default function init() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}