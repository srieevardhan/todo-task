require("dotenv").config();
const User = require("./models/User");
const { User: UserFromIndex } = require("./models");

console.log("Direct Import:", User);
console.log("Index Import:", UserFromIndex);

if (User && typeof User.findOne === 'function') {
    console.log("✅ User model loaded correctly via direct import");
} else {
    console.log("❌ User model direct import FAILED");
}

if (UserFromIndex && typeof UserFromIndex.findOne === 'function') {
    console.log("✅ User model loaded correctly via index import");
} else {
    console.log("❌ User model index import FAILED");
}
