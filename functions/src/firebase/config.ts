export default {
  type: "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: "firebase-adminsdk-iit3y@tevelam-5c6b4.iam.gserviceaccount.com",
  client_id: process.env.CLIENTE_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-iit3y%40tevelam-5c6b4.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
