const multer = require("multer");

const excelFilter = (req, file, callBack) => {
  console.log(" ======= file");
 try {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    callBack(null, true);
  } else {
    callBack("Please upload only excel file.", false);
  }
 } catch (error) {
   console.log(error);
 }
};
let storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    console.log(__basedir);
    callBack(null, __basedir + "resources/static/assets/uploads/");
  },

  filename: (req, file, callBack) => {
    console.log(file);
    callBack(null, `${Date.now()}-staff-${file.originalname}`);
  },
});
let uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;