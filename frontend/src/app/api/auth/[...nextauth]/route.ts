import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { setCookie } from "nookies";
import { cookies } from "next/headers";

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

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "", // 在這裡添加 secret
  callbacks: {
    async signIn(params) {
      const { user, account, profile } = params;
      console.log("user", user);

      if (user) {
        // 在这里调用你的自定义登录逻辑
        const userData = await loginGPASS(user.name, user.email, user.image);

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
    // async redirect(params) {
    //   return "/";
    // },
  },
});

export { handler as GET, handler as POST };
