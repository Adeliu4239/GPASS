const poolConnection = require("../utils/dbConnection");

exports.getAllClasses = async () => {
  const connection = await poolConnection();
  const query = `
            SELECT id, name, grade
            FROM classes
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
}

exports.getClassId = async (className) => {
  const connection = await poolConnection();
  const query = `
            SELECT id
            FROM classes
            WHERE name = ?
            `;
  const queryParams = [className];
  try {
    const [rows] = await connection.query(query, queryParams);
    if (rows.length === 0) {
      return null;
    }
    return rows[0].id;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

exports.getClassName = async (classId) => {
  const connection = await poolConnection();
  const query = `
            SELECT name
            FROM classes
            WHERE id = ?
            `;
  const queryParams = [classId];
  try {
    const [rows] = await connection.query(query, queryParams);
    if (rows.length === 0) {
      return null;
    }
    return rows[0].name;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
}

exports.getClassesByGrade = async (grade) => {
  const connection = await poolConnection();
  const query = `
            SELECT id, name, grade
            FROM classes
            WHERE grade = ?
            `;
  const queryParams = [grade];
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

exports.createClass = async (className, grade, connection) => {
  const query = `
      INSERT INTO classes (name, grade)
      VALUES (?, ?)
    `;
  const queryParams = [className, grade];

  try {
    const [result] = await connection.query(query, queryParams);
    return result.insertId;
  } catch (err) {
    console.error(err);
    return null;
  }
};
