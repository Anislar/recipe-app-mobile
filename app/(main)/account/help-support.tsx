import { View, Text, StyleSheet, Linking } from "react-native";

import { Button, ScreenWrapper, Accordion } from "@/components";
import { hp, wp } from "@/helpers/common";
import { useTranslation } from "react-i18next";
import { THEME } from "@/constants/theme";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "How do I reset my password?",
    answer:
      "Go to Account > Edit Password. If you forgot it, use 'Forgot Password' on the login screen to receive a reset link by email.",
  },
  {
    question: "How do I update the app?",
    answer:
      "Visit the App Store (iOS) or Google Play Store (Android) and search for the app to download the latest version.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Go to Account > Settings > Delete Account. This action is permanent and cannot be undone.",
  },
];

export default function HelpSupport() {
  const { t } = useTranslation();
  const handleEmailSupport = () => {
    Linking.openURL("mailto:larguetanis@gmail.com");
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQs</Text>
          {faqs.map((faq, index) => (
            <Accordion key={index} title={faq.question} content={faq.answer} />
          ))}
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("support.help")} </Text>
          <Button
            icon="send"
            buttonStyle={{
              marginTop: hp(2),
              height: hp(5),
              gap: 5,
            }}
            title={t("support.email")}
            onPress={handleEmailSupport}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: wp(3),
  },

  section: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.1),
    fontWeight: THEME.fonts.medium,
    marginBottom: hp(2),
  },
});
