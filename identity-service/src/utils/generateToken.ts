import jwt from "jsonwebtoken";
import RefreshToken from "../middleware/refreshToken";
import { logger } from "./logger";


export const generateToken = async (user) => {
  try {
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.jWT_SECRET || '',
      { expiresIn: "60m" }
    );
    const refreshToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.jWT_SECRET || '',
      { expiresIn: "7d" }
    );

     await RefreshToken.create({
        token: refreshToken,
        user: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600)
    })

      return {accessToken, refreshToken}

  } catch (e: unknown) {
    logger.error(e);
  }
};

// const accessToken = jwt.sign(
//     {
//       userId: user._id,
//       username: user.username,
//     },
//     process.env.jWT_SECRET,
//     {expiresIn: '60m '}
//   );

//   const refreshToken = crypto.randomBytes(40).toString('hex')
//   const expiresAt = new Date();
//   expiresAt.setDate(expiresAt.getDate() + 7)

//   await RefreshToken.create({
//       token: refreshToken,
//       user: user._id,
//       expiresAt
//   })

//   return {accessToken, refreshToken}
