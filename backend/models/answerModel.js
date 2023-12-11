const poolConnection = require("../utils/dbConnection");

exports.getAnswerList = async (exerciseId, paging) => {
  const connection = await poolConnection();
  if (!paging) paging = 0;
  const pageSize = 10;
  const offset = parseInt(paging, 10) * pageSize;
  let query = `
        SELECT id, exercise_id, creator_id, content, created_at, image_url, hide_name
        FROM answers
        WHERE deleted_at IS NULL AND exercise_id = ?
        `;
  const queryParams = [exerciseId];
  query += "ORDER BY created_at DESC LIMIT ? OFFSET ?";
  queryParams.push(pageSize);
  queryParams.push(offset);
  try {
    const [rows] = await connection.query(query, queryParams);
    const answers = rows;
    return answers;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

exports.getAnswerById = async (answerId) => {
  const connection = await poolConnection();
  const query = `
        SELECT id, exercise_id, creator_id, content, created_at, image_url, hide_name
        FROM answers
        WHERE deleted_at IS NULL AND id = ?
        `;
  const queryParams = [answerId];
  try {
    const [rows] = await connection.query(query, queryParams);
    if (rows.length === 0) {
      return null;
    }
    const answer = rows[0];
    return answer;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

exports.createAnswer = async (answer, connection) => {
  const query = `
        INSERT INTO answers (exercise_id, creator_id, content, image_url, hide_name)
        VALUES (?, ?, ?, ?, ?)
        `;
  const queryParams = [
    answer.exerciseId,
    answer.userId,
    answer.content,
    answer.imageUrl,
    answer.hideName,
  ];
  try {
    const [result] = await connection.query(query, queryParams);
    const updateQuery = `
        UPDATE exercises
        SET updated_at = CURRENT_TIMESTAMP()
        WHERE id = ?
        `;
    const updateParams = [answer.exerciseId];
    await connection.query(updateQuery, updateParams);
    const answerId = result.insertId;
    return answerId;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
}

exports.updateAnswer = async (answer, connection) => {
  const query = `
        UPDATE answers
        SET content = ?, image_url = ?, created_at = CURRENT_TIMESTAMP()
        WHERE id = ?
        `;
  const queryParams = [
    answer.content,
    answer.imageUrl,
    answer.answerId,
  ];
  try {
    const [result] = await connection.query(query, queryParams);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
}

exports.deleteAnswer = async (answerId) => {
  const connection = await poolConnection();
  const query = `
        UPDATE answers
        SET deleted_at = CURRENT_TIMESTAMP()
        WHERE id = ?
        `;
  const queryParams = [answerId];
  try {
    const [result] = await connection.query(query, queryParams);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
}