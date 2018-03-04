// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
  jwt: {
    key: "somecomplextjwtkeygoeshere"
  },
  iam: {
    url: "http://localhost:8080" //IAM server location
  }
};
