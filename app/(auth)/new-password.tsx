import { withSuspense } from "@/components";
import { lazy } from "react";

const NewPassword = lazy(
  () => import("@/components/auth/screens/new-password.screen")
);

export default withSuspense(NewPassword);
