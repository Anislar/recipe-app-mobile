import { useEffect } from "react";
import { useSearchParams } from "expo-router/build/hooks";
import { useAuthStore } from "@/store";
import { DefaultFallback } from "@/components/with-suspense";
import { Text, View } from "react-native";
import { THEME } from "@/constants/colors";
import { hp } from "@/helpers/common";

const OauthRedirect = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { getCurrentUser, error, setToken } = useAuthStore();

  useEffect(() => {
    if (token) {
      setToken(token);
      setTimeout(async () => {
        await getCurrentUser();
      }, 0);
    }
  }, [getCurrentUser, setToken, token]);
  if (error)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
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
      </View>
    );
  return <DefaultFallback />;
};

export default OauthRedirect;
