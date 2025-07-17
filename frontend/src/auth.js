import AppID from 'ibmcloud-appid-js';

const appID = new AppID();

export const initAuth = async () => {
  await appID.init({
    clientId: "cd5904fd-87b4-4d36-bbc2-d52ead0f7b71",  
    discoveryEndpoint: "https://au-syd.appid.cloud.ibm.com/oauth/v4/e3a3d6c9-4f13-48cf-97a5-ffa1bebcbb55/.well-known/openid-configuration", // 🔁 Your discovery endpoint
    redirectUri: "http://localhost:3000"
  });

  try {
    const tokens = await appID.signin();
    const userInfo = await appID.getUserInfo(tokens.accessToken);
    return { tokens, userInfo };
  } catch (err) {
    console.error("🔴 Login failed:", err);
  }
};

