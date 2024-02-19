import jwt from "jsonwebtoken";
import { UserInfo } from "./adapters/db_controller";

const generateJWT = (user: UserInfo) => {
  return jwt.sign(
    {
      username: user.username,
      email: user.email,
    },
    "sde",
    {
      expiresIn: "1d",
    },
  );
};

export default generateJWT;
