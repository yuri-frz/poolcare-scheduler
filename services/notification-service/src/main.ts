import "dotenv/config";
import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3003);

createApp().listen(port, () => {
  console.log(`Notification Service running on port ${port}`);
});
