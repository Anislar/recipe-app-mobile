import { withSuspense } from "@/components";
import { lazy } from "react";

const SignIn = lazy(() => import("@/components/auth/screens/sign-in.screen"));

export default withSuspense(SignIn);
