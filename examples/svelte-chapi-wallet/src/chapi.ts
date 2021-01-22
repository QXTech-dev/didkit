import { activateHandler, installHandler } from "web-credential-handler";

import type { Wallet } from "./store";
import Config from "./config";

export const registerWallet = async () => {
  try {
    await credentialHandlerPolyfill.loadOnce(Config.MEDIATOR);
  } catch (e) {
    console.error("Error in loadOnce:", e);
  }

  // const registration =
  await installHandler({ url: Config.WALLET_WORKER_URL });

  /*await registration.credentialManager.hints.set("test", {
      name: "User",
      enabledTypes: ["VerifiablePresentation", "VerifiableCredential"],
    });*/

  console.log("Wallet registered!");
};

export const activateWalletEventHandler = async () => {
  try {
    await credentialHandlerPolyfill.loadOnce(Config.MEDIATOR);
  } catch (e) {
    console.error("Error in loadOnce:", e);
  }

  console.log("Worker Polyfill loaded, mediator:", Config.MEDIATOR);

  return activateHandler({
    mediatorOrigin: Config.MEDIATOR,
    async get(event) {
      console.log("WCH: Received get() event:", event);
      return {
        type: "redirect",
        url: Config.WALLET_GET_URL,
      };
    },
    async store(event) {
      console.log("WCH: Received store() event:", event);
      return {
        type: "redirect",
        url: Config.WALLET_STORE_URL,
      };
    },
  });
};
