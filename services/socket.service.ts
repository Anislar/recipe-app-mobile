import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;
    this.socket = io(process.env.EXPO_PUBLIC_API_URL as string, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      autoConnect: true,
    });
    this.socket.on("connect", () => {
      console.log("Socket connected");
      console.log("Socket ID:", this.socket?.id);
    });
    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  getSocket() {
    return this.socket;
  }
  on(event: string, callback: Function) {
    this.socket?.on(event, (...args: any[]) => callback(...args));
  }

  off(event: string, callback: Function) {
    this.socket?.off(event, (...args: any[]) => callback(...args));
  }

  emit(event: string, ...args: any[]) {
    this.socket?.emit(event, ...args);
  }
}

export const socketService = new SocketService();
