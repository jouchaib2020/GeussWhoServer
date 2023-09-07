import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

// Configure passport.js to use LocalStrategy
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      // Find the user with the provided email
      const user = await User.findOne({ where: { email } });

      // If user does not exist or password does not match, return error
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Authentication successful, return the user
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


// log in function to handle user authentication
export const login = (req, res, next) => {
  console.log(`------incoming LOGIN reqest body : username = ${req.body.email}, password=${req.body.password} `)
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    // Log in the user and return a response
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.status(200).json({ message: 'Login successful', user: {id: user.id, email: user.email}});
    });
  })(req, res, next);
};

export const logout = async (req, res) => {
  req.logout((loginErr) => {
    if (loginErr) {
      return next(loginErr);
    }});
  res.status(200).json({ message: 'Logout successful' });
};
