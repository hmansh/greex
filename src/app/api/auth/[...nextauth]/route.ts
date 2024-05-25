import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

const { handlers: { GET, POST }, auth } = NextAuth(authConfig);

export { GET, POST, auth };
