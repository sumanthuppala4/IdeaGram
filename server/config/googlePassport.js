import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./../db/database.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const username = profile.displayName;
      const email = profile.emails?.[0]?.value || null;

      db.get(
        "SELECT * FROM users WHERE username = ?",
        [email],
        (err, existingUser) => {
          if (err) return done(err);

          if (existingUser) {
            console.log("Found existing user:", existingUser);
            return done(null, existingUser);
          }

          db.run(
            "INSERT INTO users ( username, password) VALUES (?, ?)",
            [email, "google"],
            function (err) {
              if (err) return done(err);

              // use this.lastID to fetch the inserted row
              db.get(
                "SELECT * FROM users WHERE id = ?",
                [this.lastID],
                (err, newUser) => {
                  if (err) return done(err);
                  console.log("Created new user:", newUser);
                  return done(null, newUser);
                }
              );
            }
          );
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializeUser got:", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("deserializeUser called with id:", id);
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) return done(err);
    console.log("Found user in DB:", row);
    done(null, row);
  });
});
