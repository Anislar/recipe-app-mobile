import React, { ReactNode } from "react";
import { Text } from "react-native";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.log("Error Boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Error occurred: {this.state.error?.message}</Text>;
    }

    return this.props.children;
  }
}
