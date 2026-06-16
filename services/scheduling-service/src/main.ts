import "dotenv/config";
import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3002);

createApp().listen(port, () => {
  console.log(`Scheduling Service running on port ${port}`);
});
