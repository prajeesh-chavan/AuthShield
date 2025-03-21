const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const { generateToken } = require("./utils/token"); // Use your existing token generator

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const token = generateToken(
          profile.emails[0].value,
          process.env.JWT_SECRET
        );
        done(null, token);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: `${process.env.BACKEND_URL}/auth/facebook/callback`,
//       profileFields: ["id", "emails", "name"],
//     },
//     (accessToken, refreshToken, profile, done) => {
//       const token = generateToken(
//         profile.emails[0].value,
//         process.env.JWT_SECRET
//       );
//       done(null, token);
//     }
//   )
// );

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
//     },
//     (accessToken, refreshToken, profile, done) => {
//       const token = generateToken(
//         profile.emails[0].value,
//         process.env.JWT_SECRET
//       );
//       done(null, token);
//     }
//   )
// );

// Serialize and deserialize user (could store user info in session or token)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
