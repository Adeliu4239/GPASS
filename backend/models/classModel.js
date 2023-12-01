const poolConnection = require("../utils/dbConnection");

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
