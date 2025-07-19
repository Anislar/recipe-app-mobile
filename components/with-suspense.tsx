import React, { Suspense } from "react";
import { Text, View } from "react-native";
import LoadingSpinner from "./UI/loading";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";

export const DefaultFallback = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
    }}
  >
    <LoadingSpinner color={THEME.colors.primary} size="large" />
    <Text
      style={{
        color: THEME.colors.text,
        fontWeight: THEME.fonts.medium,
        fontSize: hp(2),
      }}
    >
      Loading ...
    </Text>
  </View>
);

export const withSuspense = <P extends object>(
  Component: React.LazyExoticComponent<React.ComponentType<any>>,
  fallback?: React.ReactNode
) => {
  return function SuspendedComponent(props: P) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };
};
