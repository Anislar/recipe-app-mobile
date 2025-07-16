import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useAuthStore } from "@/store";

export const useClearAuthStateOnFocus = () => {
  useFocusEffect(
    useCallback(() => {
      useAuthStore.getState().setResetElement();
    }, [])
  );
};
