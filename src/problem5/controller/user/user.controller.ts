import { genSaltSync, hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../../config/data-source";
import { User } from "../../entity/user";
import { Token } from "../../entity/token";

const userRepository = AppDataSource.getRepository(User);
const tokenRepository = AppDataSource.getRepository(Token);

/**
 * This function is used to create user
 * @param req Request body parameter
 * @param res Response object
 * @param next NextFunction callback
 * @returns user information
 */
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await userRepository.findOneBy({ email });
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email already exist",
      });
    }

    const saltRounds = genSaltSync(10);
    const hashedPassword = hashSync(password, saltRounds);

    const newUser = userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    const savedUser = await userRepository.save(newUser);

    return res.status(StatusCodes.CREATED).json({
      data: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        displayName: `${savedUser.firstName} ${savedUser.lastName}`,
      },
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

/**
 * This function is used to sign in user
 * @param req Request body parameter
 * @param res Response object
 * @param next NextFunction callback
 * @returns user information and token
 */
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.findOne({
      where: { email },
      relations: ["tokens"],
    });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email or password incorrect",
      });
    }

    if (compareSync(password, user.password) === false) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email or password incorrect",
      });
    }

    const refreshToken = uuidv4();
    const token = await jwt.sign(
      { email: user.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const date = new Date();
    const expiresIn = date.setDate(date.getDate() + 30);
    const tokenData = tokenRepository.create({
      userId: user.id,
      refreshToken,
      expiresIn,
    });
    await tokenRepository.save(tokenData);
    return res.status(StatusCodes.OK).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        displayName: `${user.firstName} ${user.lastName}`,
      },
      token,
      refreshToken,
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

/**
 * This function is used to sign out user
 * @param req Request body parameter
 * @param res Response object
 * @param next NextFunction callback
 * @returns result http status code and message
 */
export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.user;
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email not found",
      });
    }

    const tokenResult = await tokenRepository.findOneBy({
      userId: user.id,
    });
    if (tokenResult) {
      await tokenRepository.delete(tokenResult.id);
    }

    return res.status(StatusCodes.NO_CONTENT).json({
      message: "Success",
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

/**
 * This function is used to get new refresh token
 * @param req Request body parameter
 * @param res Response object
 * @param next NextFunction callback
 * @returns new token and refresh token
 */
export const getNewRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    const tokenData = await tokenRepository.findOne({
      where: { refreshToken },
      relations: ["user"],
    });
    if (!tokenData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Refresh token invalid",
      });
    }

    if (tokenData.expiresIn < Date.now()) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Token is expired",
      });
    }
    await tokenRepository.delete(tokenData.id);
    const newRefreshToken = uuidv4();
    const token = jwt.sign(
      { email: tokenData.user?.email },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "1h" }
    );
    const date = new Date();
    const expiresIn = date.setDate(date.getDate() + 30);
    await tokenRepository.save({
      userId: tokenData.userId,
      refreshToken: newRefreshToken,
      expiresIn,
    });

    return res.status(StatusCodes.OK).json({
      token,
      refreshToken: newRefreshToken,
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getNewRefreshToken,
};
