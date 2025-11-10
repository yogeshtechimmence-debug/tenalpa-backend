import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "tenalpachat",
  private_key_id: "5b742762c04f39795b0d44716a4b8e13f213c69c",
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDvzQgqBVHW3NP9
XrYuNswWC51XK2F1rXsHV85WwF7V4/EttfgCIjVZXWKLID857fHh/0rh1HtiB8bX
APPQUgQ3SN0ek43TjTY0BM78tLdxu0Bc6BlEOntWwFgpzydEHwAlTteUilE4a31C
i21wuiwhIc1GTRQxZhfIkTa46ga+Mf95AzhOEX62nGjzzTEfVTJSYf6leCs9T4a1
v8Vx7x5MKcnweu7y+0VkNs7qkte19aPRLSmCE6NNc6IozvsybBR5hQQTXKqKiBuo
/eqknOsGXooq6TzX6/69xO/BJoBWD0U2qf8sWVFCvfd4chcnk8wAMMcBfB2hYfoc
U9isjYQ/AgMBAAECggEAYUog/tNrsa2kQE6VwUgwIt2Rd1U9VD4PBRqlt2KS11qE
dhQ2y77PQDN4EJQDsuAL27H00oyfhlU7Ye2b/a/Y0Ak61PXue572F8K/q50yM+1R
np/36EuF0Nt2qXfHKYceSwSiyDwZ2bcaec4Rl8Ogtcx9+QC6qZQPICtyNTGVjMH5
IgHD+qPyO3Qwf/4qseV80+QI/JiaOL+K2h+vfVQAs83ioNIzmed0NFHpazCDbyYl
51QOHqiLnuqeU7fFZ2nLLf60LYZIODY3KGlJoL8BekIGdNhsTJcR4tqwcWjnuaNU
9vIHvWpp94iv/d7JW+YmQkDydaRHwrqT5LFlKVM6eQKBgQD6kBEfxaY4xQEGXgSy
Vvhp/rM9Qk/hlHWKXUBs/2SaJuNy1u5p+1dgIUvpFiwkBvnCNmAewdI7Ren0lfAX
Ws02PE8v9b0mjTuu9Z/UIyXBOFXeYty7m8Cui7jFMfE8rHDzVxkT8Y4SnF1bwGtv
B5Vetp8xiBvBJASFBR55smLMqwKBgQD1AS4xt0eI/83k7YHqQofowB/lTbDYEIdN
z9AFx+r1wiOH2+ltCmedA8aXyx7SktNu8JPbU3Y7lPsm2tvMWRswdvDtu9YW/FJo
4cU5HkL8ni17VZn6Vh9yag7UkgaWFT/woJ41ZlmGNL2tcE8RKQoQ0Nc3ddN/yTid
UGL6/iE+vQKBgA9xJ40EulzPT2PcEYAIOiEWMGe7GX82jhPr8VeGWeXiNaxTMLhZ
ZCYphysjUa8auvPMNBpRKaq7gVKwlu5pizInf13eUDz7AU2kF6iUTfRdi3U8NIxf
af2X4NhOXqa1nfRxTrta7L2a42oPLs/V8M+4g5Ei6Ur69Ehaa2lmpA4nAoGAGRao
21BwU9gWBmZH0mxDrJLX8Uw2Wrm+kTpBjAX/ynC54LSlP5Q8LfjwAiU7n8aHPioG
igQO7GUCHuV0coWBYkIbw8xjTPFDoxfTcVjm9SVhdOq8HMVq7PVtVVkqsX21kXdx
G/jCHBsUfUkt34z7SeOI1lYLdV9um7VanWcekmUCgYEA1ue9EdDQmRRpNvNm+uOs
4AWo9D5hDgBqMhFB9Gexip2OY+PVX47oHBbMqrB/noMg02v0XAmvZUyWwezMFThU
Dlv8g/yNvEa9R0NUOsMsKe5fEHw2dM8BBamtU5KdJUnj2egH+jaMK8QXxvMwSAHr
R9i1pFD9w1o245AvVsElTm4=
-----END PRIVATE KEY-----`,
  client_email: "firebase-adminsdk-fbsvc@tenalpachat.iam.gserviceaccount.com",
  client_id: "110758202154080185080",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40tenalpachat.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully");
  } catch (error) {
    console.error("❌ Firebase Admin initialization failed:", error.message);
  }
}

export const sendNotification = async (user, notification) => {
  try {
    console.log(`Attempting push notification for user: ${user.id}`);

    if (!user.fcm_token || user.fcm_token.length < 50) {
      console.log("Invalid FCM token, skipping notification");
      return;
    }

    const message = {
      token: user.fcm_token,
      notification: {
        title: notification.title,
        body: notification.message,
      },
      data: notification.data,
      android: {
        priority: "high",
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            sound: "default",
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending notification:", error);

    // Specific errors handle karein
    if (error.code === "messaging/invalid-registration-token") {
      console.log("Invalid FCM token");
    } else if (error.code === "messaging/registration-token-not-registered") {
      console.log("FCM token not registered");
    }

    return null;
  }
};