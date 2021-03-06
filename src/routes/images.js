import express from "express";
import fs from "fs";
import path from "path";

//
import { writeLog } from "../utilities.js";

const router = express.Router();

router.get("/QR/:key", (req, res) => {
  let key = req.params.key;
  if (!key) {
    return res.status(400).json({ message: "Bad request" }).end();
  }
  fs.readdir(path.join(__dirname, "../storage/qr"), (err, files) => {
    res.setHeader("Content-Type", "application/json");
    if (err) {
      writeLog(err);
      return res.status(500).json({ message: "internal error" });
    }

    for (let i = 0; i < files.length; i++) {
      let [, extension] = files[i].split("."); // get Extension for prepare header

      if (files[i].substring(0, files[i].lastIndexOf(".")) == key) {
        // key match with one qr
        res.setHeader("Content-Type", `image/${extension}`);
        let fd = fs.createReadStream(`${path.join(__dirname, "../storage/qr")}/${files[i]}`);
        return fd.pipe(res);
      }
    }

    return res.status(204).json({ message: "Image not found" }).end();
  });
});

export default router;
