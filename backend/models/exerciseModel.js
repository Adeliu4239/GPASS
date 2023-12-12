const poolConnection = require("../utils/dbConnection");

exports.getExerciseList = async (examId, paging) => {
  const connection = await poolConnection();
  if (!paging) paging = 0;
  const pageSize = 10;
  const offset = parseInt(paging, 10) * pageSize;
  let query = `
            SELECT id, exam_id, question, content, created_at, updated_at, deleted_at, hot_id, creator_id, hide_name
            FROM exercises
            WHERE deleted_at IS NULL AND exam_id = ?
            `;
  const queryParams = [examId];
  query += "ORDER BY created_at DESC LIMIT ? OFFSET ?";
  queryParams.push(pageSize);
  queryParams.push(offset);
  try {
    const [rows] = await connection.query(query, queryParams);
    // if (rows.length === 0) {
    //   return res.status(404).json({ error: "Exercise not found" });
    // }
    const exercises = rows;
    return exercises;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

exports.getExerciseById = async (exerciseId) => {
  const connection = await poolConnection();
  const query = `
            SELECT id, exam_id, question, content, created_at, updated_at, deleted_at, hot_id, creator_id, hide_name
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
    return exercise;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

exports.createExercise = async (examId, exercise, connection) => {
  console.log("haha");
  const query = `
        INSERT INTO exercises (exam_id, question, content, creator_id, hide_name)
        VALUES (?, ?, ?, ?, ?)
        `;
  const hideName = exercise.hideName ? 1 : 0;
  const queryParams = [
    examId,
    exercise.question,
    exercise.content,
    exercise.creator,
    hideName,
  ];
  try {
    const [rows] = await connection.query(query, queryParams);
    const exerciseId = rows.insertId;
    return exerciseId;
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.createExerciseImage = async (exerciseId, imageUrl, connection) => {
  const query = `
        INSERT INTO exercise_images (exercise_id, image_url)
        VALUES (?, ?)
        `;
  const queryParams = [exerciseId, imageUrl];
  try {
    const [rows] = await connection.query(query, queryParams);
    return "ok";
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.updateExercise = async (exerciseId, exercise, connection) => {
  const query = `
        UPDATE exercises
        SET question = ?, content = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `;
  const queryParams = [exercise.question, exercise.content, exerciseId];
  try {
    const [rows] = await connection.query(query, queryParams);
    return rows.affectedRows;
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.deleteExercise = async (exerciseId) => {
  const connection = await poolConnection();
  const query = `
        UPDATE exercises
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `;
  const queryParams = [exerciseId];
  try {
    const [rows] = await connection.query(query, queryParams);
    return rows.affectedRows;
  } catch (err) {
    console.error(err);
    return null;
  }
};
