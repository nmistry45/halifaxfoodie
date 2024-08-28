import { CognitoUserPool } from "amazon-cognito-identity-js";

const hfxPool = {
  UserPoolId: "us-east-1_xOCE3EtLL",
  ClientId: "11dle8g5jt6vbvks2ri22ig03g",
};

export default new CognitoUserPool(hfxPool);
