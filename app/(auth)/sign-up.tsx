import { withSuspense } from "@/components";
import { lazy } from "react";

const SignUp = lazy(() => import("@/components/auth/screens/sign-up.screen"));

export default withSuspense(SignUp);
