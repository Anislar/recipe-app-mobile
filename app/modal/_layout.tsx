import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store";

const ModalLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return (
    <Stack>
      <Stack.Screen
        name="add-post"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default ModalLayout;
