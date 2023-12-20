import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from 'next/headers'

async function loginGPASS(username: any, email: any, photo: any) {
  console.log("Logging in with GPASS...");
  const url = `${process.env.NEXT_PUBLIC_API_URL}/user/signin`;
  console.log(url);
  const data = {
    id: "",
    name: username,
    email,
    photo: photo,
    provider: "google",
  };
  const res = await axios.post(url, data);
  console.log(res.data);

  return res.data;
}

const nextAuthOptions = async (req: NextApiRequest, res: NextApiResponse) => {
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
      }),
    ],
    callbacks: {
      async signIn(params: any) {
        const { user, account, profile } = params;
        console.log("user", user);

        if (user) {
          // 在这里调用你的自定义登录逻辑
          const userData = await loginGPASS(user.name, user.email, user.image);
          console.log("userData", userData);
          cookies().set('token', userData.access_token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          cookies().set('userName', userData.user.name, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          cookies().set('userId', userData.user.id, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          cookies().set('userPhoto', userData.user.photo, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });

        }

        // 返回 true 表示登录成功
        return true;
      },
    },
  };
};

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, await nextAuthOptions(req, res));
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, await nextAuthOptions(req, res));
};