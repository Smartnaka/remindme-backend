import { NextRequest, NextResponse } from "next/server";

import { sendPushNotificationToAllUsers } from "@/server/notifications";

type NotifyRequestBody = {
  message?: string;
  platform?: "android" | "ios" | "all";
  branch?: string;
};

export async function POST(request: NextRequest) {
  try {
    // Verify the request is coming from GitHub Actions.
    const authHeader = request.headers.get("x-github-actions-secret");
    const expectedSecret = process.env.APP_ACTIONS_SECRET;

    if (!expectedSecret) {
      console.error("[App Update] APP_ACTIONS_SECRET not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    if (authHeader !== expectedSecret) {
      console.error("[App Update] Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as NotifyRequestBody;
    const { message, platform, branch } = body;
    const deepLinkUrl = process.env.APP_DEEP_LINK_URL || "remindme://";

    const result = await sendPushNotificationToAllUsers({
      title: "RemindMe Update Available 🚀",
      body: message || "A new preview version is available. Open the app to update.",
      sound: "default",
      data: {
        url: deepLinkUrl,
        actionType: "update",
        platform: platform || "android",
        branch: branch || "preview",
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      ...result,
      message: "App update notifications sent successfully",
    });
  } catch (error) {
    console.error("[App Update] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to send notifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
