const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

console.log("🚀 Starting Combined Super Server...");

const loadEnv = (folderPath) => {
  const fullPath = path.join(__dirname, folderPath, '.env');
  if (fs.existsSync(fullPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(fullPath));
    for (const k in envConfig) { process.env[k] = envConfig[k]; }
    console.log(`✅ Loaded env: ${folderPath}`);
  }
};

// 1. Careersync (8080)
loadEnv('careersync-server/Backend');
process.env.PORT = 8080;
const app1 = require('./careersync-server/Backend/src/server.js');

// 2. Edu (8081)
loadEnv('edu');
process.env.PORT = 8081;
const app2 = require('./edu/server.js');

console.log("\n--- 🚀 Launching ---");

// Start both servers
const start = (app, port, name) => {
  if (app && typeof app.listen === 'function') {
    app.listen(port, () => console.log(`🟢 ${name} online: http://localhost:${port}`));
  }
};

start(app1, 8080, "Careersync");
start(app2, 8081, "Edu Backend");

console.log("\n⭐ System Ready. Do not close this terminal.");