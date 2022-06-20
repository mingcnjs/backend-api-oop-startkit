import admin from "firebase-admin";
import config from "../../config";

const firebaseApp = admin.initializeApp({
  projectId: config.firebase.projectId,
  // https://firebase.google.com/docs/auth/admin/create-custom-tokens#using_a_service_account_id
  serviceAccountId: config.firebase.serviceAccountId,
  credential: config.firebase.credential
    ? admin.credential.cert(config.firebase.credential)
    : admin.credential.applicationDefault(),
});

const firestore = firebaseApp.firestore();

firestore.settings({
  ignoreUndefinedProperties: true,
});

const firebaseAuth = firebaseApp.auth();

export { firestore, firebaseAuth };
