import { View, Text, Button } from "react-native";
import React from "react";
import { useAuthStore } from "@/store";

const Home = () => {
  const { logout } = useAuthStore();
  return (
    <View>
      <Text>Home</Text>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
};

export default Home;
