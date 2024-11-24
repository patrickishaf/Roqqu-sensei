import {bootstrapApplication} from "./server";
import {connectToDb} from "./db";

const main = async () => {
  try {
    await connectToDb();
    bootstrapApplication();
  } catch (err: any) {
    console.log(`failed to start application. error:`, err.message);
  }
}

main();