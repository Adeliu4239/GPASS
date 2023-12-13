require("dotenv").config();
const qs = require('qs');
const { default: axios } = require("axios");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const OAuth2Strategy = require('passport-oauth2').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // 此處可以處理驗證成功後的操作
      // 例如將使用者資料存進資料庫
      console.log("accessToken");
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      return done(null, profile);
    }
  )
);

passport.use('nycu', new OAuth2Strategy({
  authorizationURL: 'https://id.nycu.edu.tw/o/authorize/',
  tokenURL: 'https://id.nycu.edu.tw/o/token/',
  clientID: process.env.NYCU_CLIENT_ID,
  clientSecret: process.env.NYCU_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/nycu/callback', // 你的回调URL
},(code, refreshToken, profile, done) => {
  // 在这里处理获取用户信息后的逻辑，你可以将用户信息存储到数据库中，或者执行其他操作
  console.log(code);
  console.log(profile);

  return done(null, profile);
}));

// 封裝 Passport.authenticate("google") 的 middleware
const authenticateGoogle = passport.authenticate("google", {
  scope: ["email", "profile"],
});

// 處理 Google 登入後的回調
const handleGoogleCallback = passport.authenticate("google", {
  session: false,
});

// const authenticateNYCU = passport.authenticate('nycu', {
//   scope: ['profile name'],
// });

const authenticateNYCU = async (req, res) =>
{
  const authorizationUrl = 'https://id.nycu.edu.tw/o/authorize/';
  const responseType = 'code';
  const scope = 'profile name';
  const redirectUri = 'http://localhost:5000/auth/nycu/callback';
  const clientId = process.env.NYCU_CLIENT_ID;
  
  const authUrl = `${authorizationUrl}?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;

  res.redirect(authUrl);
}

const handleNYCUCallback = async (req, res, next) => {
  const { code } = req.query;
  console.log(code);

  const tokenUrl = 'https://id.nycu.edu.tw/o/token/';
  const redirectUri = 'http://localhost:5000/auth/nycu/callback';
  const tokenData = {
    grant_type: 'authorization_code',
    code,
    client_id: process.env.NYCU_CLIENT_ID,
    client_secret: process.env.NYCU_CLIENT_SECRET,
    redirect_uri: redirectUri,
  };

  try {
    const tokenResponse = await axios.post(tokenUrl, qs.stringify(tokenData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = tokenResponse.data.access_token;
    console.log(accessToken);
    const userUrl = 'https://id.nycu.edu.tw/api/profile/';
    const user = await axios.get(userUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    req.user = user.data;
    console.log(user.data);
    next();

  } catch (error) {
    console.error('Error during login:', error.message);
    res.send('Error during login');
  }
};
module.exports = {
  authenticateGoogle,
  handleGoogleCallback,
  authenticateNYCU,
  handleNYCUCallback,
};
