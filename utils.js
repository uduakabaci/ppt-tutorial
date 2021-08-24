const stringify = require("csv-stringify");
const { writeFileSync } = require("fs");

function writeCSV(data, name) {
  if (!Array.isArray(data)) throw new Error("data must data");

  return new Promise((resolve, reject) => {
    stringify(data, { header: true }, (err, output) => {
      if (err) return reject(err);
      writeFileSync(name, output);
      resolve(true);
    });
  });
}

module.exports = { writeCSV };
