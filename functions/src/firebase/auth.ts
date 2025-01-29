// Cloud Functions uses your function's url as the `targetAudience` value
const targetAudience =
  "https://us-central1-tevelam-5c6b4.cloudfunctions.net/tevelamFunctions";
// For Cloud Functions, endpoint (`url`) and `targetAudience` should be equal
const functionUrl = targetAudience;

import { GoogleAuth } from "google-auth-library";
const auth = new GoogleAuth({
  scopes: "https://www.googleapis.com/auth/cloud-platform",
});

async function request() {
  console.info(`request ${functionUrl} with target audience ${targetAudience}`);
  const clientIdToken = await auth.getIdTokenClient(targetAudience);

  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;

  // Alternatively, one can use `client.idTokenProvider.fetchIdToken`
  // to return the ID Token.
  const res = await client.request({ url });
  console.log(res, clientIdToken);
}

request().catch(err => {
  console.error(err.message);
  process.exitCode = 1;
});
