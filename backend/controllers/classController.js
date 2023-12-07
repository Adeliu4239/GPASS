const errorRes = require("../utils/errorResponse");
const classModel = require("../models/classModel");

const classController = {
  getAllClasses: async (req, res) => {
    console.log("getAllClasses");
    try {
      const classes = await classModel.getAllClasses();
      if (!classes) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      return res.status(200).json({ classes });
    } catch (err) {
      console.error(err);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
  getClassesByGrade: async (req, res) => {
    console.log("getClassesByGrade");
    try {
      const grade = req.params.grade;
      if (!grade) {
        const [errorCode, errorMessage] = errorRes.gradeMissing();
        return res.status(errorCode).json({ error: errorMessage });
      }
      const classes = await classModel.getClassesByGrade(grade);
      if (!classes) {
        const [errorCode, errorMessage] = errorRes.queryFailed();
        return res.status(errorCode).json({ error: errorMessage });
      }
      return res.status(200).json({ classes });
    } catch (err) {
      console.error(err);
      const [errorCode, errorMessage] = errorRes.dbConnectFailed();
      return res.status(errorCode).json({ error: errorMessage });
    }
  },
};

module.exports = classController;