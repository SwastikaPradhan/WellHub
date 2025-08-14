
import { Client, Account, Databases,ID,Storage } from "appwrite";

const appwriteUrl = process.env.NEXT_PUBLIC_APPWRITE_URL;
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;


if (!appwriteUrl || !appwriteProjectId) {
  throw new Error("Missing required Appwrite environment variables");
}
const client = new Client()
   .setEndpoint(appwriteUrl) 
  .setProject(appwriteProjectId);
  console.log(appwriteUrl);
  console.log(appwriteProjectId)

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
export {client,account,databases,storage,ID};
