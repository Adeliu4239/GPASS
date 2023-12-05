const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // 此處可以處理驗證成功後的操作
      return done(null, profile);
    }
  )
);

// 封裝 Passport.authenticate("google") 的 middleware
const authenticateGoogle = passport.authenticate("google", {
  scope: ["email", "profile"],
});

// 處理 Google 登入後的回調
const handleGoogleCallback = passport.authenticate("google", {
  session: false,
});

module.exports = {
  authenticateGoogle,
  handleGoogleCallback,
};
