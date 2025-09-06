import { Suspense } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { THEME } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { LoadingSpinner } from "./UI/loading";
import { useSelectedColors } from "@/store";

export const DefaultFallback = ({
  isReady,
  error,
}: {
  isReady?: boolean;
  error?: string | null;
}) => {
  const selected = useSelectedColors();
  const { t } = useTranslation();

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
        {error || (!isReady ? "Loading" : t("common.loading") + " ...")}
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
