const config = {
  port: process.env.PORT,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "test-website",
    serviceAccountId: process.env.FIREBASE_SERVICE_ACCOUNT_ID,
    credential: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    webApiKey: process.env.FIREBASE_WEB_API_KEY,
    authEmulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
  },
  email: {
    fromAddress: process.env.EMAIL_FROM_ADDRESS,
    clientId: process.env.GOOGLE_CLIENT_ID,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  },
  appURL: process.env.APP_URL || "http://localhost:3000",
};

export default config;
