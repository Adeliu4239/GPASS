const errorRes = require("../utils/errorResponse");
const userUtil = require("../utils/userUtils");
const contentType = require("content-type");

const adminController = {
  authorization: async (req, res, next) => {
    console.log("authorization");
    const authorization = req.headers.cookie ? req.headers.cookie : null;
    console.log(authorization);
    if (!authorization) {
      return res.redirect('/login');
    }
    try {
      const accessToken = authorization.replace("token=", "");
      const payload = await userUtil.decodePayload(accessToken);
      if (!payload) {
        const [errorCode, errorMessage] = errorRes.tokenInvalid();
        return res.status(errorCode).json({ error: errorMessage });
      }
      console.log(payload);
      if (payload.role !== "admin") {
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
};

module.exports = adminController;