const userModel = require("../models/userModel");
const userUtil = require("../utils/userUtils");
const errorRes = require("../utils/errorResponse");

const userController = {
  signin: async (req, res) => {
    console.log("signin");
    try {
      const user = {
        id: req.user.id,
        name: req.user.displayName,
        email: req.user.emails[0].value,
        photo: req.user.photos[0].value,
        provider: req.user.provider,
      };
      if(!user.email){
        const [errorCode, errorMessage] = errorRes.emailNotFound();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (req.user.provider === "google") {
        user.picture = req.user.photos[0].value;
      }
      const userExist = await userModel.getUserByEmail(user.email);
      if (userExist) {
        const token = await userUtil.generateAccessToken(userExist);
        const responseData = {
          access_token: token,
          access_expired: 604800,
          user: {
            id: userExist.id,
            provider: userExist.provider,
            name: userExist.name,
            email: userExist.email,
            photo: userExist?.photo || null,
            role: userExist.role,
          },
        };
        res.cookie("token", token);
        return res.status(200).json({ data: responseData });
      }
      const userId = await userModel.createUser(user);
      user.id = userId;
      const token = await userUtil.generateAccessToken(user);
      const responseData = {
        access_token: token,
        access_expired: 604800,
        user: {
          id: userId,
          provider: req.body.provider,
          name: user.name,
          email: user.email,
          picture: user?.picture || null,
          role: user.role,
        },
      };
      res.cookie("token", token);
      return res.status(200).json({ data: responseData });
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  logout: async (req, res) => {
    console.log("logout");
    try {
      res.clearCookie("token");
      return res.status(200).json({ data: "ok" });
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  authorization: async (req, res, next) => {
    console.log("authorization");
    const authorization = req.headers.authorization;
    if (!authorization) {
      const [errorCode, errorMessage] = errorRes.tokenNotFound();
      return res.status(errorCode).json({ error: errorMessage });
    }
    try {
      const accessToken = req.headers.authorization.replace("Bearer ", "");
      const payload = await userUtil.decodePayload(accessToken);
      if (!payload) {
        const [errorCode, errorMessage] = errorRes.tokenInvalid();
        return res.status(errorCode).json({ error: errorMessage });
      }
      req.user = payload;
      console.log(req.user);
      return next();
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.tokenInvalid();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },

  getUserProfile: async (req, res) => {
    console.log("getUserProfile");
    try {
      const user = await userModel.getUserById(req.user.id);
      return res.status(200).json({ data: user });
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
};

module.exports = userController;
