import { useEffect } from "react";
import { Text, View } from "react-native";
import { useSearchParams, useRouter } from "expo-router/build/hooks";
import { useAuthStore } from "@/store";
import { DefaultFallback } from "@/components/with-suspense";
import { THEME } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { Button } from "@/components";
import { showToast } from "@/helpers/toastService";
import { useTranslation } from "react-i18next";
import { useSelectedColors } from "@/store";

const OauthRedirect = () => {
  const { t } = useTranslation();
  const selected = useSelectedColors();
  const searchParams = useSearchParams();
  const token = searchParams?.get?.("token");
  const { getCurrentUser, error, setToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      setToken(token);
      setTimeout(async () => {
        const response = await getCurrentUser();
        if (typeof response === "boolean") {
          showToast(t("auth.signIn.welcomeBack"));
          router.replace("/");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (error)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <Text
          style={{
            color: THEME.colors.rose,
            fontWeight: THEME.fonts.medium,
            fontSize: hp(2.5),
          }}
        >
          {error.message}
        </Text>

        <Button
          onPress={() => router.push("/sign-in")}
          title="Back to Sign in"
          loading={false}
          hasShadow
          buttonStyle={{
            backgroundColor: selected.primaryDark,
            marginVertical: 10,
            paddingHorizontal: wp(15),
          }}
        />
      </View>
    );
  return <DefaultFallback />;
};

export default OauthRedirect;
