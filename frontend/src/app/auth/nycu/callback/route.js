import { NextRequest } from "next/server";
import { setCookie } from "nookies";
import axios from "axios";
import qs from "qs";
import { NextResponse } from "next/server";

async function loginGPASS(username, email) {
  console.log("Logging in with GPASS...");
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/signin`;
  console.log(url);
  const data = {
    id: "gpass",
    name: username,
    email,
    photo: null,
    provider: "nycu",
  };
  const res = await axios.post(url, data);
  return res.data;
}

export async function GET(req) {
  const code = req.nextUrl.searchParams.get("code");
  console.log(code);

  const tokenUrl = "https://id.nycu.edu.tw/o/token/";
  // const redirectUri = "http://localhost:3000/auth/nycu/callback";
  const redirectUri = `https://gpass-adeliu4239.vercel.app/auth/nycu/callback`;
  const tokenData = {
    grant_type: "authorization_code",
    code: code,
    client_id: process.env.NEXT_PUBLIC_NYCU_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_NYCU_CLIENT_SECRET,
    redirect_uri: redirectUri,
  };

  console.log(process.env.NEXT_PUBLIC_NYCU_CLIENT_ID);
  console.log(process.env.NEXT_PUBLIC_NYCU_CLIENT_SECRET);
  try {
    console.log("Getting access token...");
    const tokenResponse = await axios.post(tokenUrl, qs.stringify(tokenData), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = tokenResponse.data.access_token;
    console.log("Access token:", accessToken);
    const userUrl = "https://id.nycu.edu.tw/api/profile/";
    const user = await axios.get(userUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(user.data);

    const result = await loginGPASS(user.data.username, user.data.email);
    console.log(result);

    let response = NextResponse.redirect(new URL("/", req.nextUrl));
    
    response.cookies.set("token", result.access_token, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    response.cookies.set("userId", result.user.id, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    response.cookies.set("userName", result.user.name, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    response.cookies.set("userPhoto", result.user.photo, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
