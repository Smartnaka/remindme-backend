declare const process: {
  env: Record<string, string | undefined>;
};

declare module "next/server" {
  export class NextRequest {
    headers: {
      get(name: string): string | null;
    };
    json(): Promise<unknown>;
  }

  export class NextResponse {
    static json(body: unknown, init?: { status?: number }): NextResponse;
  }
}

declare module "expo-server-sdk" {
  export type ExpoPushMessage = {
    to: string;
    title: string;
    body: string;
    sound?: "default";
    data?: Record<string, unknown>;
  };

  export type ExpoPushTicket = {
    status: "ok" | "error";
    details?: {
      error?: string;
    };
  };

  export class Expo {
    static isExpoPushToken(token: string): boolean;
    chunkPushNotifications(messages: ExpoPushMessage[]): ExpoPushMessage[][];
    sendPushNotificationsAsync(messages: ExpoPushMessage[]): Promise<ExpoPushTicket[]>;
  }
}
