import { ConvexReactClient } from "convex/react";


if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined in your environment!");
}

export const convexClient = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL
);
