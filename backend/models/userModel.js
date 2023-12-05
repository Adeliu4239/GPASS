const poolConnection = require("../utils/dbConnection");

exports.isEmailExist = async (email) => {
  console.log("isEmailExist");
  const connection = await poolConnection();
  const query = `
      SELECT COUNT(id)
      FROM users
      WHERE email = ?
      `;
  let queryParams = [email];
  try {
    const existingUserCount = await connection.query(query, queryParams);
    return existingUserCount[0][0]["COUNT(id)"] > 0;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

exports.createUser = async (user) => {
  const connection = await poolConnection();
  const query = `
    INSERT INTO users (name, email, photo, provider)
    VALUES (?, ?, ?, ?)
    `;
  const queryParams = [user.name, user.email, user.photo, user.provider];
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

exports.getUserByEmail = async (email) => {
  const connection = await poolConnection();
  const query = `
    SELECT id, name, email, photo, provider
    FROM users
    WHERE email = ?
    `;
  const queryParams = [email];
  try {
    const [rows] = await connection.query(query, queryParams);
    if (rows.length === 0) {
      return null;
    }
    const user = rows[0];
    return user;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

exports.getUserById = async (id) => {
  const connection = await poolConnection();
  const query = `
    SELECT provider, name, email, photo
    FROM users
    WHERE id = ?
    `;
  const queryParams = [id];
  try {
    const [rows] = await connection.query(query, queryParams);
    if (rows.length === 0) {
      return null;
    }
    const user = rows[0];
    console.log(user);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};
