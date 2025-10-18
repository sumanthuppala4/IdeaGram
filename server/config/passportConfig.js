import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import db from "../db/database.js";

export default function initialize(passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, user) => {
          if (err) return done(err);
          if (!user) return done(null, false, { message: "User not found" });

          const match = await bcrypt.compare(password, user.password);
          if (!match)
            return done(null, false, { message: "Incorrect password" });

          return done(null, user);
        }
      );
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
      if (err) return done(err);
      done(null, user);
    });
  });
}
