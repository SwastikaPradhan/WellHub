'use client';
import { useRouter } from 'next/navigation';

export default function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Clear token
      localStorage.removeItem("token");

      // Redirect to homepage (or login)
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return handleLogout;
}
