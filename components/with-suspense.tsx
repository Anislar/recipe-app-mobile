import React, { Suspense } from "react";
import LoadingSpinner from "./UI/loading";
import { THEME } from "@/constants/colors";

export const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<any>>,
  fallback?: React.ReactNode
) => {
  return function SuspendedComponent(props: any) {
    return (
      <Suspense
        fallback={
          fallback || (
            <LoadingSpinner color={THEME.colors.primary} size="large" />
          )
        }
      >
        <Component {...props} />
      </Suspense>
    );
  };
};
