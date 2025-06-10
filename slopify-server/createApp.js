import "dotenv/config";
import cors from "cors";
import jwt from "jsonwebtoken";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import { Strategy as LocalStrategy } from "passport-local";
import { connectToDatabase, getDb, getUserByEmail, CreateUser } from "./db.js";
import { initEvents } from "./initEvents.js";
import { getCookieOptions, hashPassword, comparePassword } from "./auth.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import typeDefs from "./graphql/types.js";
import resolvers from "./graphql/resolvers.js";
import bodyParser from "body-parser";
const { json } = bodyParser;

const app = express();

async function createApp({ testMode = false, user = null } = {}) {
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await getUserByEmail(email.toLowerCase());
      if (!user) return done(null, false, { message: "Utilisateur non trouvé" });

      const isMatch = await comparePassword({ user, password });
      if (!isMatch) return done(null, false, { message: "Mot de passe incorrect" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

app.get('/events', authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const events = await db.collection('events').find().toArray();
    res.json(events);
  } catch (err) {
    console.error("❌ Erreur récupération événements :", err);
    res.status(500).send("Erreur serveur");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email et mot de passe requis" });

  const existingUser = await getUserByEmail(email.toLowerCase());
  if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

  const hashedPassword = await hashPassword(password);

  await CreateUser({ email: email.toLowerCase(), password: hashedPassword });

  const user = await getUserByEmail(email.toLowerCase());

  const token = jwt.sign(
    {id: user._id, email: email.toLowerCase() },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(201).json({ message: "Utilisateur créé avec succès", token });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Échec de la connexion" });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, getCookieOptions());
    res.sendStatus(200);
  })(req, res, next);
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", getCookieOptions());
  res.sendStatus(200);
});

function authenticateToken(req, res, next) {
  const token = req.cookies?.token;
  console.log(req.cookies);
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

await connectToDatabase();
  await initEvents();
  await apolloServer.start();
  app.use('/graphql',
    cors({ origin: 'http://localhost:5173', credentials: true }),
    cookieParser(),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        const token = req.cookies?.token;
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET);
          return { user };
        } catch {
          return {};
        }
      }
    }))
    return app;;
} export { createApp };
