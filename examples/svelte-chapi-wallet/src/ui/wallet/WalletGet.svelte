<script lang="ts">
  import { navigate } from "svelte-navigator";
  import { receiveCredentialEvent } from "web-credential-handler";

  import { WalletItem } from "../component";

  import Config from "../../config.ts";
  import { walletState } from "../../store.ts";
  import { copyToClipboard } from "../../utils.ts";

  let wstate;
  walletState.subscribe((value) => {
    wstate = value;
  });

  let reason = "";
  let origin = "";

  let present = () => null;
  let cancel = null;

  const handleGetEvent = async () => {
    present = () => null;
    cancel = null;

    if (wstate === null) {
      navigate(`/sign-in?redirect=${Config.WALLET_GET}`);
      return;
    }

    const event = await receiveCredentialEvent();
    origin = event.credentialRequestOrigin;

    const vp = event.credentialRequestOptions.web.VerifiablePresentation;
    const query = Array.isArray(vp.query) ? vp.query[0] : vp.query;

    if (query.type !== "QueryByExample") {
      throw new Error(
        "Only QueryByExample requests are supported in demo wallet."
      );
    }

    reason = query.credentialQuery.reason;

    present = (data) => () => {
      event.respondWith(
        Promise.resolve({ dataType: "VerifiablePresentation", data })
      );
    };

    cancel = () => {
      event.respondWith(
        Promise.resolve({ dataType: "Response", data: "error" })
      );
    };
  };

  credentialHandlerPolyfill.loadOnce(Config.MEDIATOR).then(handleGetEvent);
</script>

<div class="container">
  <h1>{origin} is requesting a credential</h1>
  <h2>Reason: {reason}</h2>

  {#if wstate !== null}
    {#each wstate.storage.getItem("data") as item}
      <WalletItem
        type={item?.type}
        copy={() => copyToClipboard(JSON.stringify(item))}
        share={present(item)}
      >
        {item?.id}
      </WalletItem>
    {/each}
  {/if}

  <button on:click={cancel}>{"Cancel"}</button>
</div>
