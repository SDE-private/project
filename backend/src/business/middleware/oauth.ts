import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // @ts-expect-error tpyes
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "632787136675-iu5ntfsrn9fuvo6oi0er4e9f7b55cukb.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    },
  ),
);

const requireGoogleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  // failureRedirect: "/auth/failed",
  keepSessionInfo: true,
  // successReturnToOrRedirect: "/auth/success",
});

export { requireGoogleAuth };
