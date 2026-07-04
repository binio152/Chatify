import User from "../models/User.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const clerkWebhook = async (req, res) => {
  const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!signingSecret) {
    return res
      .status(503)
      .json({ message: "Webhook secret is not provided" });
  }

  try {
    const payload = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : String(req.body);

    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: req.headers,
      body: payload,
    });

    const event = await verifyWebhook(request, { signingSecret });

    switch (event.type) {
      case "user.created": {
        const user = event.data;
        const email =
          user.email_addresses?.find(
            (e) => e.id === user.primary_email_address_id,
          )?.email_address ?? user.email_addresses?.[0]?.email_address;
        const fullName =
          [user.first_name, user.last_name].filter(Boolean).join(" ") ||
          user.username ||
          email?.split("@")[0];

        await User.findOneAndUpdate(
          { clerkId: user.id },
          {
            clerkId: user.id,
            email,
            fullName,
            profileImageUrl: user.image_url,
          },
          {
            new: true,
            upsert: true,
            setDefaultOnInsert: true,
          },
        );

        console.log("User created:", user.id);
        break;
      }

      case "user.updated": {
        const user = event.data;
        const email =
          user.email_addresses?.find(
            (e) => e.id === user.primary_email_address_id,
          )?.email_address ?? user.email_addresses?.[0]?.email_address;
        const fullName =
          [user.first_name, user.last_name].filter(Boolean).join(" ") ||
          user.username ||
          email?.split("@")[0];

        await User.findOneAndUpdate(
          { clerkId: user.id },
          {
            email,
            fullName,
            profileImageUrl: user.image_url,
          },
          {
            new: true,
          },
        );

        console.log("User updated:", user.id);
        break;
      }

      case "user.deleted": {
        if (event.data.id) {
          await User.findOneAndDelete({
            clerkId: event.data.id,
          });

          console.log("User deleted:", event.data.id);
        }

        break;
      }

      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("Error processing Clerk webhook:", err);

    return res.status(400).json({
      message: "Webhook verification failed",
    });
  }
};

export default clerkWebhook;