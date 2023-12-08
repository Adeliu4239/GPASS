/* eslint-disable dot-notation */
/* eslint-disable prefer-destructuring */

"use client";

import { parseCookies } from "nookies";

const getCookies = () => {
  const cookies = parseCookies();
  const userId = cookies["userId"];
  const userName = cookies["userName"];
  const userPhoto = cookies["userPhoto"];
  const accessToken = cookies["token"];
  return { userId, userName, userPhoto, accessToken };
};

export default getCookies;
