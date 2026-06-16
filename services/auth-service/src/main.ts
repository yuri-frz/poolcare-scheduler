import "dotenv/config";
import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3001);

createApp().listen(port, () => {
  console.log(`Auth Service running on port ${port}`);
});
