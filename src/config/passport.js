const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            provider: "google",
            provider_id: profile.id,
          });
        }
        console.log("User :", user);
        return done(null, user);
      } catch (err) {
        console.error("GOOGLE AUTH ERROR:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
