const bcrypt = require('bcrypt');

const password = "Jk@17";
const hash = "$2b$10$5mhEevAKwUk/xoj1DFFlGOD85WffK8WTBv3v1E7fFqktDjM75VmZW";

bcrypt.compare(password, hash, (err, result) => {
  if (err) throw err;
  console.log("✅ MATCH:", result);
});
