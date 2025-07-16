import Toast, { ToastOptions } from "react-native-root-toast";

let currentToast: Toast | null = null;

export const showToast = (message: string, options?: ToastOptions) => {
  if (currentToast) {
    Toast.hide(currentToast);
    currentToast = null;
  }

  currentToast = Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    ...options,
  });

  // Auto-hide after duration + small buffer (default 2.5s)
  setTimeout(() => {
    if (currentToast) {
      Toast.hide(currentToast);
      currentToast = null;
    }
  }, (options?.duration ?? Toast.durations.SHORT) + 500);
};
