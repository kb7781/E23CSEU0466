require("dotenv").config();

const Log = require("./logger");

Log(
  "frontend",
  "info",
  "component",
  "notification UI initialized",
  process.env.ACCESS_TOKEN
);