/* eslint-disable dot-notation */
/* eslint-disable prefer-destructuring */

"use client";

import { parseCookies } from "nookies";

const getCookies = () => {
  const cookies = parseCookies();
  // const userId = cookies["userId"];
  // const userName = cookies["userName"];
  const accessToken = cookies["accessToken"];
  return { accessToken };
};

export default getCookies;
