const config = {
  port: process.env.PORT,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "test-website",
    webApiKey: process.env.FIREBASE_WEB_API_KEY,
    authEmulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
  },
  email: {
    fromAddress: process.env.EMAIL_FROM_ADDRESS,
    clientId: process.env.GOOGLE_CLIENT_ID,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  },
};

export default config;
