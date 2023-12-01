const poolConnection = require("../utils/dbConnection");

exports.getExamList = async (classId, paging) => {
  const connection = await poolConnection();
  if(!paging) paging = 0;
  const pageSize = 10;
  const offset = parseInt(paging, 10) * pageSize;
  let query = `
        SELECT id, type, teacher, year, rating_id, main_file, ans_file, sheet_files, has_ans
        FROM exams
        WHERE deleted_at IS NULL
        `;
  const queryParams = [];
  if (classId) {
    query += " AND class_id = ?";
    queryParams.push(classId);
  }
  query += " ORDER BY id DESC LIMIT ? OFFSET ?";
  queryParams.push(pageSize);
  queryParams.push(offset);
  try {
    const [rows] = await connection.query(query, queryParams);
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
        SELECT id, type, teacher, year, rating_id, main_file, ans_file, sheet_files, has_ans
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
    exam.main_file,
    exam.ans_file,
    exam.sheet_files,
    exam.has_ans === 'true' ? 1 : 0,
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