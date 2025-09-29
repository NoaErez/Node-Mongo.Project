const fs = require("fs");
const path = require("path");

const logger = (req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      const logMessage = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode}\n`;
      const logDir = path.join(__dirname, "../logs");

      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
      }

      const logFile = path.join(logDir, `${new Date().toISOString().slice(0,10)}.log`);
      fs.appendFileSync(logFile, logMessage);
    }
  });

  next();
};

module.exports = logger;

