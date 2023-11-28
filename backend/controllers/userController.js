const userModel = require("../models/userModel");
const userUtil = require("../utils/userUtils");
const errorRes = require("../utils/errorResponse");
const contentType = require("content-type");

const userController = {
  signup: async (req, res) => {
    console.log("signup");
    try {
      const requestHeader = contentType.parse(req.headers["content-type"]);

      if (!req.body.name || !req.body.email || !req.body.password) {
        const [errorCode, errorMessage] = errorRes.bodyMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (requestHeader.type !== "application/json") {
        const [errorCode, errorMessage] = errorRes.contentTypeError();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (!userUtil.isValidEmail(req.body.email)) {
        const [errorCode, errorMessage] = errorRes.invalidEmailFormat();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (await userModel.isEmailExist(req.body.email)) {
        const [errorCode, errorMessage] = errorRes.emailExist();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (!userUtil.isValidPasswords(req.body.password)) {
        const [errorCode, errorMessage] = errorRes.invalidPasswordFormat();
        return res.status(errorCode).json({ error: errorMessage });
      }

      const encryptPassword = await userUtil.encryptPassword(req.body.password);
      const user = {
        provider: "native",
        name: req.body.name,
        email: req.body.email,
        password: encryptPassword,
      };

      const result = await userModel.createUser(user);
      if (result) {
        const user = await userModel.getUserById(result);
        const token = await userUtil.generateAccessToken(user);
        const responseData = {
          access_token: token,
          access_expired: 604800,
          user: {
            id: result,
            provider: user.provider,
            name: user.name,
            email: user.email,
            picture: user?.picture || null,
          },
        };
        return res.status(200).json({ data: responseData });
      }
      const [errorCode, errorMessage] = errorRes.queryFailed();
      return res.status(errorCode).json({ error: errorMessage });
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },

  signin: async (req, res) => {
    console.log("signin");
    try {
      const requestHeader = contentType.parse(req.headers["content-type"]);
      if (
        req.body.provider === "native" &&
        (!req.body.email || !req.body.password)
      ) {
        const [errorCode, errorMessage] = errorRes.bodyMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (req.body.provider === "facebook" && !req.body.access_token) {
        const [errorCode, errorMessage] = errorRes.bodyMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (requestHeader.type !== "application/json") {
        const [errorCode, errorMessage] = errorRes.contentTypeError();
        return res.status(errorCode).json({ error: errorMessage });
      }

      const user = await userModel.getUserByEmail(req.body.email);
      if (!user) {
        const [errorCode, errorMessage] = errorRes.userNotFound();
        return res.status(errorCode).json({ error: errorMessage });
      }
      if (
        !(await userUtil.isPasswordCorrect(req.body.password, user.password))
      ) {
        const [errorCode, errorMessage] = errorRes.incorrectPassword();
        return res.status(errorCode).json({ error: errorMessage });
      }

      const token = await userUtil.generateAccessToken(user);
      const responseData = {
        access_token: token,
        access_expired: 604800,
        user: {
          id: user.id,
          provider: req.body.provider,
          name: user.name,
          email: user.email,
          picture: user?.picture || null,
          role: user.role,
        },
      };
      res.cookie('token', token);
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
      res.clearCookie('token');
      return res.status(200).json({ data: "ok" });
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  authorization: async (req, res, next) => {
    console.log("authorization");
    console.log(req);
    console.log(req.headers);
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
      // if (!user) {
      //   const [errorCode, errorMessage] = errorRes.userNotFound();
      //   return res.status(errorCode).json({ error: errorMessage });
      // }
      return res.status(200).json({ data: user });
    } catch (error) {
      console.log(error);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
};

module.exports = userController;
