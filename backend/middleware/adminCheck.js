const userUtil = require("../utils/userUtils");
const errorRes = require("../utils/errorResponse");

// const authorization = async (req, res, next) => {
//   console.log("authorization");
//   const authorizationCookie = req.headers.cookie ? req.headers.cookie : null;
//   console.log(authorizationCookie);

//   if (!authorizationCookie) {
//     const [errorCode, errorMessage] = errorRes.tokenNotFound();
//     return res.status(errorCode).json({ error: errorMessage });
//   }

//   try {
//     const accessToken = authorizationCookie.replace("token=", "");
//     const payload = await userUtil.decodePayload(accessToken);

//     if (!payload) {
//       const [errorCode, errorMessage] = errorRes.tokenInvalid();
//       return res.status(errorCode).json({ error: errorMessage });
//     }

//     console.log(payload);

//     // if (payload.role !== "admin") {
//     //   const [errorCode, errorMessage] = errorRes.tokenInvalid();
//     //   return res.status(errorCode).json({ error: errorMessage });
//     // }

//     req.user = payload;
//     return next();
//   } catch (error) {
//     console.log(error);
//     const [errorCode, errorMessage] = errorRes.tokenInvalid();
//     return res.status(errorCode).json({ error: errorMessage });
//   }
// };

const authorization = async (req, res, next) => {
  console.log("authorization");
  const authorization = req.headers.authorization;
  console.log(req.headers);
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
};

module.exports = authorization;
