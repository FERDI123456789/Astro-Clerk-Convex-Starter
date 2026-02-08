import { httpAction } from "./_generated/server";
import type { ActionCtx } from "./_generated/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

console.log("Loading convex/clerk.ts");

export const handleClerkWebhook = httpAction(
  async (ctx: ActionCtx, request: Request) => {
    console.log("Webhook triggered");

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error(
        "CLERK_WEBHOOK_SECRET is not set in Convex environment variables!",
      );
      return new Response("CLERK_WEBHOOK_SECRET is not set", { status: 500 });
    }

    const payload = await request.text();

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const wh = new Webhook(WEBHOOK_SECRET);
    let msg;

    try {
      msg = wh.verify(payload, headers) as any;
      console.log("Webhook verified successfully.");
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error verifying webhook", { status: 400 });
    }

    const isUserEvent =
      msg.type === "user.updated" || msg.type === "user.created";

    if (isUserEvent) {
      const { id, first_name, last_name, image_url, public_metadata } =
        msg.data;

      const userName = `${first_name || ""} ${last_name || ""}`.trim();
      const userProfilePic = image_url;
      const role =
        (public_metadata?.role as "admin" | "standard") ?? "standard";

      console.log(`Upserting user ${id}: name=${userName}, role=${role}`);

      // Upsert user into Convex "users" table
      await ctx.runMutation((internal as any).messages.upsertUser, {
        userId: id,
        userName,
        userProfilePic,
        role,
      });

      // Optional: update messages with new profile info
      await ctx.runMutation((internal as any).messages.updateUserProfile, {
        userId: id,
        userName,
        userProfilePic,
      });

      // Optional: update userRole on all messages
      await ctx.runMutation(
        (internal as any).messages.updateUserRoleOnMessages,
        {
          userId: id,
          role,
        },
      );

      console.log("User and message info updated successfully.");
    }

    console.log("Webhook handler finished. Returning 200.");
    return new Response("Webhook received", { status: 200 });
  },
);
