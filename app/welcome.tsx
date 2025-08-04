import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";

import { ScreenWrapper, Button } from "@/components";
import { hp, wp } from "@/helpers/common";
import { THEME } from "@/constants/theme";
import { useSelectedColors } from "@/store";

const WelcomScreen = () => {
  const { t } = useTranslation();
  const selected = useSelectedColors();

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* welcom image */}
        <Image
          style={styles.image}
          source={require("@/assets/images/welcome.png")}
          contentFit="contain"
        />
        {/* welcome text */}
        <View style={{ gap: hp(2) }}>
          <Text style={styles.title}>{t("welcome.title")}</Text>
          <Text style={styles.punchline}>{t("welcome.punchline")}</Text>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Link href="/sign-up" push asChild>
            <Button
              hasShadow={false}
              loading={false}
              textStyle={{
                fontSize: hp(2.5),
              }}
              title={t("welcome.gettingStarted")}
            />
          </Link>
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>
              {t("welcome.alreadyHaveAccount")}
            </Text>
            <Link href="/(auth)/sign-in" push>
              <Text
                style={[
                  styles.loginText,
                  {
                    textDecorationLine: "underline",
                    color: selected.primaryDark,
                    fontWeight: THEME.fonts.semibold,
                  },
                ]}
              >
                {t("auth.signIn.signIn")}
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: wp(4),
    gap: hp(10),
  },
  image: {
    marginTop: hp(10),
    width: wp(100),
    height: hp(30),
    alignSelf: "center",
  },
  title: {
    color: THEME.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: THEME.fonts.extraBold,
  },
  punchline: {
    color: THEME.colors.darkGray,
    fontSize: hp(2),
    textAlign: "center",
  },
  footer: {
    gap: hp(3),
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: THEME.colors.text,
    fontSize: hp(2),
  },
});
export default WelcomScreen;
