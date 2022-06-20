import admin from "firebase-admin";
import config from "../../config";

const firebaseApp = admin.initializeApp({
  projectId: config.firebase.projectId,
});

const firestore = firebaseApp.firestore();

firestore.settings({
  ignoreUndefinedProperties: true,
});

const firebaseAuth = firebaseApp.auth();

export { firestore, firebaseAuth };
