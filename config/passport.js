const jwt = require("jwt-simple");
const nodeify = require("nodeify");
const { ObjectId } = require("mongodb");

// load up the user model
var User = require("../app/models/user");

// read config
var configAuth = require("./auth");

// load passport goodies
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  async function userFromPayload(request, jwtPayload) {
    if (!jwtPayload.userId) {
      throw new Error("No userId in JWT");
    }
    return await User.findById(ObjectId(jwtPayload.userId));
  }

  const cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
      console.log("extractor: jwt: ", req.cookies["jwt"]);
      token = req.cookies["jwt"];
    }
    if (!token && req.user && req.user._id) {
      console.log("extractor: user: ", req.user._id);
      const payload = {
        userId: req.user._id.toString()
      };
      token = jwt.encode(payload, configAuth.jwt.key);
    }
    req.token = token;
    return token;
  };

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: configAuth.jwt.key,
        passReqToCallback: true
      },
      async (request, jwtPayload, done) => {
        nodeify(userFromPayload(request, jwtPayload), done);
      }
    )
  );
};
