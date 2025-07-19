import { withSuspense } from "@/components";
import { lazy } from "react";

const VerifyCode = lazy(
  () => import("@/components/auth/screens/verify-code.screen")
);

export default withSuspense(VerifyCode);
