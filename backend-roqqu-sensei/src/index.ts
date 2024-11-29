import {bootstrapApplication} from "./server";
import {connectToDb} from "./db";
import {bootstrapChatAgent} from "./agent";

const main = async () => {
  try {
    await connectToDb();
    bootstrapChatAgent();
    bootstrapApplication();
  } catch (err: any) {
    console.log(`failed to start application. error:`, err.message);
  }
}

main();