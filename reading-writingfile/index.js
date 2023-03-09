const fs = require("fs");

// Blocking , sync way
const textRead = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textRead);

const textout = `hello guys: ${textRead}.\n ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textout);

const text1 = fs.readFileSync("./txt/output.txt", "utf-8");
console.log(text1);

// Non-Blocking , async function
const text2 = fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
  console.log(data);
});
console.log("reading file....");
