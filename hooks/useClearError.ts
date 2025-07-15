import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useAuthStore } from "@/store";

export const useClearAuthErrorOnFocus = () => {
  useFocusEffect(
    useCallback(() => {
      useAuthStore.getState().setError(null);
    }, [])
  );
};
