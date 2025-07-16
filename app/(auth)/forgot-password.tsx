import { withSuspense } from "@/components";
import { lazy } from "react";

const ForgotPassword = lazy(
  () => import("@/components/auth/screens/forgot-password.screen")
);

export default withSuspense(ForgotPassword);
