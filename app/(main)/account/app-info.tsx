import {
  View,
  Text,
  Linking,
  Platform,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { useTranslation } from "react-i18next";
import { hp, wp } from "@/helpers/common";
import { Button, ScreenWrapper, Separator } from "@/components";
import { THEME } from "@/constants/theme";
import CardComponent from "@/components/UI/card";

const APP_STORE_URL = "itms-apps://itunes.apple.com/app/idYOUR_IOS_APP_ID";
const PLAY_STORE_URL = "market://details?id=YOUR_ANDROID_PACKAGE_NAME";

export default function AppInfoScreen() {
  const { t } = useTranslation();

  const handleRateApp = async () => {
    const url = Platform.OS === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else Alert.alert(t("appInfo.storeNotAvailable"));
  };

  const handleCheckForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(t("appInfo.updateAvailable"), t("appInfo.installing"));
        await Updates.fetchUpdateAsync();
        Updates.reloadAsync(); // restart app with new update
      } else {
        Alert.alert(t("appInfo.upToDate"));
      }
    } catch (e: any) {
      Alert.alert(t("appInfo.updateFailed"), e?.message);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <CardComponent>
          <Text style={styles.title}>{t("account.appInfo")}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>{t("appInfo.app")}:</Text>
            <Text style={styles.value}>
              {Constants.expoConfig?.name ?? "N/A"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t("appInfo.version")}:</Text>
            <Text style={styles.value}>
              {Constants.expoConfig?.version ?? "N/A"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t("appInfo.build")}:</Text>
            <Text style={styles.value}>
              {Constants.expoConfig?.android?.versionCode ?? "N/A"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t("appInfo.sdk")}:</Text>
            <Text style={styles.value}>
              {Constants.expoConfig?.sdkVersion ?? "N/A"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t("appInfo.platform")}:</Text>
            <Text style={styles.value}>{Platform.OS ?? "N/A"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t("appInfo.environment")}:</Text>
            <Text style={styles.value}>
              {__DEV__ ? t("appInfo.development") : t("appInfo.production")}
            </Text>
          </View>
          <Separator />

          <View style={styles.buttonWrapper}>
            <Button
              buttonStyle={styles.button}
              onPress={handleCheckForUpdates}
              title={t("appInfo.checkForUpdates")}
            />
            <Button
              buttonStyle={styles.button}
              onPress={handleRateApp}
              title={t("appInfo.rateApp")}
            />
          </View>
        </CardComponent>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: wp(5),
  },
  card: {
    backgroundColor: THEME.colors.grayLight,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1e1e1e",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "500",
    color: "#555",
    textTransform: "capitalize",
  },
  value: {
    color: "#222",
    textTransform: "capitalize",
  },
  buttonWrapper: {
    gap: hp(2),
    marginTop: hp(1.5),
  },
  button: {
    maxHeight: hp(4.8),
  },
});
