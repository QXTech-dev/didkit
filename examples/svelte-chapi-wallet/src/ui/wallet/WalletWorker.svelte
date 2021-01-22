<script lang="ts">
  import { activateHandler } from "web-credential-handler";

  import Config from "../../config.ts";

  const activateWalletEventHandler = async () => {
    try {
      await credentialHandlerPolyfill.loadOnce(Config.MEDIATOR);
    } catch (e) {
      console.error("Error in loadOnce:", e);
    }

    return activateHandler({
      mediatorOrigin: Config.MEDIATOR,
      async get(event) {
        return {
          type: "redirect",
          url: Config.WALLET_GET_URL,
        };
      },
      async store(event) {
        return {
          type: "redirect",
          url: Config.WALLET_STORE_URL,
        };
      },
    });
  };

  activateWalletEventHandler();
</script>
