const { rejects } = require("assert");
const fs = require("fs");
const { resolve } = require("path");
const superagent = require("superagent");

// Building promise

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("No file found");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("cant write data");
      resolve("success");
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed:${data}`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro("dog-link.txt", res.body.message);
    console.log("random image saved");
  } catch (err) {
    console.log(err);
  }
};
getDogPic();

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed:${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePro("dog-link.txt", res.body.message);
//   })
//   .then(() => {
//     console.log("random image saved");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// fs.readFile(`${__dirname}/dog.txt`, "utf-8", (err, data) => {
//   console.log(`Breed:${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);
//       fs.writeFile("dog-link.txt", res.body.message, (err) => {
//         console.log("random image ");
//       });
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });
