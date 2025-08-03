import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useAuthStore } from "@/store";

export const useClear = () => {
  useFocusEffect(
    useCallback(() => {
      useAuthStore.getState().setResetElement();
    }, [])
  );
};

// Add the missing export that other files are trying to import
export const useClearError = useClear;
