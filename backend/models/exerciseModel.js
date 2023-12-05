const poolConnection = require("../utils/dbConnection");

exports.getExerciseList = async (examId, paging) => {
  const connection = await poolConnection();
  if (!paging) paging = 0;
  const pageSize = 10;
  const offset = parseInt(paging, 10) * pageSize;
  let query = `
            SELECT id, exam_id, question, content, created_at, updated_at, deleted_at, hot_id
            FROM exercises
            WHERE deleted_at IS NULL AND exam_id = ?
            `;
  const queryParams = [examId];
  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  try {
    const [rows] = await connection.query(query, queryParams);
    // if (rows.length === 0) {
    //   return res.status(404).json({ error: "Exercise not found" });
    // }
    const exercises = rows;
    return res.status(200).json({ data: exercises });
  } catch (err) {
    console.error(err);
    const [errorCode, errorMessage] = errorRes.dbConnectFailed();
    return res.status(errorCode).json({ error: errorMessage });
  } finally {
    connection.release();
  }
};

exports.getExerciseById = async (exerciseId) => {
  const connection = await poolConnection();
  const query = `
            SELECT id, exam_id, question, content, created_at, updated_at, deleted_at, hot_id
            FROM exercises
            WHERE id = ?
            `;
  const queryParams = [exerciseId];
  try {
    const [rows] = await connection.query(query, queryParams);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    const queryImage = `
    SELECT exercise_id, image_url
    FROM exercise_images
    WHERE exercise_id = ?
    `;
    const imageParams = [exerciseId];
    const [images] = await connection.query(queryImage, imageParams);
    const exercise = rows[0];
    exercise.images = images;
    return res.status(200).json({ data: exercise });
  } catch (err) {
    console.error(err);
    const [errorCode, errorMessage] = errorRes.dbConnectFailed();
    return res.status(errorCode).json({ error: errorMessage });
  } finally {
    connection.release();
  }
};
