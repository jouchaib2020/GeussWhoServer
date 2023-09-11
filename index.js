import express from 'express';
import session from 'express-session';
import passport from 'passport';
import router from './routes/route.js';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { prealoadDatabase } from './preLoadDatabase.js';


dotenv.config();


const app = express();

// Add middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({origin: 'https://jouchaib2020.github.io',credentials: true}));

// Import and use the API routes
app.use('/api',router);

// Passport session authentication middleware
app.use(passport.authenticate('session'));

// sync the models
sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
  })
  .then(()=> prealoadDatabase())
  .catch((error) => {
    console.error('Unable to sync the database:', error);
  });
 

app.get('/', (req, res) => {
  res.status(200).send('HELLO SERVER 🎊🎊');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server started on port ${port}`);
});

//pre-load the data base with 5 users and 7 pages 