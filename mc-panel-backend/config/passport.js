import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "./db.js";

export default function setupPassport() {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing in .env");
    }

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;

            // بررسی وجود کاربر
            let userQuery = await pool.query("SELECT * FROM users_google WHERE google_id=$1", [profile.id]);

            let user;
            if (userQuery.rows.length === 0) {
                // اگر کاربر موجود نبود، اضافه کن و رکورد اول return بگیر
                const insertQuery = await pool.query(
                    `INSERT INTO users_google
                         (google_id, email, name, given_name, family_name, picture, locale)
                     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
                    [profile.id, email, profile.displayName, profile.name.givenName, profile.name.familyName, profile.photos[0].value, profile._json.locale]
                );
                user = insertQuery.rows[0];
            } else {
                user = userQuery.rows[0];
            }

            // چک مطمئن بودن id قبل return
            if (!user.id) {
                return done(new Error("User ID missing in DB"), null);
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));

    return passport;
}
