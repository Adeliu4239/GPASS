import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";

export default function useLogout() {
  const router = useRouter();
  const handleLogout = () => {
    destroyCookie(null, "token");
    destroyCookie(null, "userId");
    destroyCookie(null, "userName");
    destroyCookie(null, "userPhoto");
    // 可以执行其他登出操作
    router.push("/login");
  };
  return { handleLogout };
}
