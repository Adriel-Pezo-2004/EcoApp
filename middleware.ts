export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/quiz/:path*", "/profile/:path*", "/leaderboard/:path*"],
}
