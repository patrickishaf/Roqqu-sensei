import {httpServer, runHttpServer} from "./server";
import {connectToDb} from "./db";

const main = async () => {
  try {
    await connectToDb();
    runHttpServer(httpServer);
  } catch (err: any) {
    console.log(`failed to start application. error:`, err.message);
  }
}

main();