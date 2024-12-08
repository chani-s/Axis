import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

type PusherRequestBody = {
  channel: string;
  event: string;
  data: unknown;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { channel, event, data }: PusherRequestBody = req.body;

    try {
      await pusher.trigger(channel, event, data);
      res.status(200).json({ message: "Event triggered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to trigger event" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
