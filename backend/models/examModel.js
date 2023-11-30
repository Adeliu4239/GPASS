const poolConnection = require("../utils/dbConnection");

exports.getExamList = async () => {
  const connection = await poolConnection();
  const query = `
        SELECT id, type, teacher, year, main_file, ans_file, sheet_files, has_ans
        FROM exams
        `;
  try {
    const [rows] = await connection.query(query);
    return rows;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

exports.getExamById = async (examId) => {
  const connection = await poolConnection();
  const query = `
        SELECT id, type, teacher, year, main_file, ans_file, sheet_files, has_ans
        FROM exams
        WHERE id = ?
        `;
  const queryParams = [examId];
  try {
    const [rows] = await connection.query(query, queryParams);
    return rows[0];
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
}

exports.uploadExam = async (exam, connection) => {
  const query = `
    INSERT INTO exams (class_id, type, teacher, year, main_file, ans_file, sheet_files, has_ans)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const queryParams = [
    exam.classId,
    exam.type,
    exam.teacher,
    exam.year,
    exam.mainFile,
    exam.ansFile,
    exam.sheetFiles,
    exam.hasAns,
  ];
  try {
    const result = await connection.query(query, queryParams);
    return result[0].insertId;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};