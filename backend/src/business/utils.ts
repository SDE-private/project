import jwt from "jsonwebtoken";
import { User } from "./database/database";

const generateJWT = (user: User) => {
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
