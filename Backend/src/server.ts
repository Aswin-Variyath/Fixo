import "reflect-metadata";

import app from "./app";
import { bootstrap } from "./bootstrap";

const PORT = Number(
  process.env.PORT ?? 3000
);

async function startServer(): Promise<void> {
  try {
    await bootstrap();

    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
}

startServer();