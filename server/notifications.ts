import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";

import { getAllExpoPushTokensFromDb, markExpoTokensInactive } from "@/server/token-store";

const expo = new Expo();

type NotificationPayload = {
  title: string;
  body: string;
  sound?: "default";
  data?: Record<string, unknown>;
};

type SendPushResult = {
  sent: number;
  tickets: number;
  invalidTokens: number;
};

export async function sendPushNotificationToAllUsers(
  payload: NotificationPayload,
): Promise<SendPushResult> {
  const tokens = await getAllExpoPushTokensFromDb();

  const messages: ExpoPushMessage[] = tokens
    .filter((token) => Expo.isExpoPushToken(token))
    .map((token) => ({
      to: token,
      title: payload.title,
      body: payload.body,
      sound: payload.sound ?? "default",
      data: payload.data ?? {},
    }));

  if (messages.length === 0) {
    return { sent: 0, tickets: 0, invalidTokens: 0 };
  }

  const chunks = expo.chunkPushNotifications(messages);
  const allTickets: ExpoPushTicket[] = [];
  const deviceNotRegisteredTokens = new Set<string>();

  for (const chunk of chunks) {
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    allTickets.push(...ticketChunk);

    ticketChunk.forEach((ticket, index) => {
      if (ticket.status === "error" && ticket.details?.error === "DeviceNotRegistered") {
        const token = chunk[index]?.to;
        if (typeof token === "string") {
          deviceNotRegisteredTokens.add(token);
        }
      }
    });
  }

  if (deviceNotRegisteredTokens.size > 0) {
    await markExpoTokensInactive([...deviceNotRegisteredTokens]);
  }

  return {
    sent: messages.length,
    tickets: allTickets.length,
    invalidTokens: deviceNotRegisteredTokens.size,
  };
}
