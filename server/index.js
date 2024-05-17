const express = require('express');
const cors = require('cors');
const app = express();

const path = require("path");
const multer = require("multer");


const authorization = require("./middleware/authorization");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
//same as app.use("/", express.json());
app.use(express.json());

//app.use(express.static(path.join(__dirname, "client/build")));

//production or dev.

/* if(process.env.NODE_ENV === "production"){
    //serve static content

    app.use(express.static(path.join(__dirname, "client/build")));
} */

app.use(cors());

// ROUTES
app.use("/auth", require("./routes/jwtAuth"));

app.use("/test", require("./routes/test"));

//return user info.

app.use("/profile", require("./routes/profile"));


const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

// ["image", "jpeg"]

const upload = multer({
  storage,
  fileFilter,
  //limits: { fileSize: 1000000000, files: 2 },
});

app.use("/upload", authorization, upload.array("file"), require("./routes/upload"));

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
}); 



/* app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
}); */