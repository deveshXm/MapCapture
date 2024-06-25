import app from "./app";
import { shutdown } from "./config";

const PORT = process.env.PORT;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("SIGTERM", () => {
  shutdown();
  server.close();
});
process.on("SIGINT", () => {
  shutdown();
  server.close();
});

export { app, server };
