import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string);
const db = client.db("hireloopdb");

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "seeker",
        // input: true lets the client pass role on sign-up.
        // SECURITY NOTE: with input: true anyone can register as "admin".
        // Before production, remove the admin option from the form and either
        // set input: false (admin assigned via DB only) or add validation.
        input: true,
        required: false,
      },
      // Server-managed upgrade flag: set only after a verified Stripe payment
      // (see /payment/success → POST /users/:id/premium on the Express
      // backend). input: false keeps the client from sending it at sign-up.
      premium: {
        type: "boolean",
        defaultValue: false,
        input: false,
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true
  },

   socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

  database: mongodbAdapter(db, {
    client
  })
});
