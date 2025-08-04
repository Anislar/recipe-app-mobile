import React, { Suspense } from "react";
import { Text, View } from "react-native";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { LoadingSpinner } from "./UI/loading";
import i18n from "@/language/i18n";
import { useSelectedColors } from "@/store";

export const DefaultFallback = ({ isReady }: { isReady?: boolean }) => {
  const selected = useSelectedColors();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 5,
        backgroundColor: "white",
      }}
    >
      <LoadingSpinner
        color={selected?.primary || THEME.colors.rose}
        size="large"
      />
      <Text
        style={{
          color: THEME.colors.text,
          fontWeight: THEME.fonts.medium,
          fontSize: hp(2),
        }}
      >
        {!isReady ? "Loading" : i18n.t("common.loading")} ...
      </Text>
    </View>
  );
};

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
