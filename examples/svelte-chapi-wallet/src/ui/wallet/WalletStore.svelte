<script lang="ts">
  import { navigate } from "svelte-navigator";
  import { receiveCredentialEvent } from "web-credential-handler";

  import Config from "../../config.ts";
  import { walletState } from "../../store.ts";

  let wstate;
  walletState.subscribe((value) => {
    wstate = value;
  });

  let issuer = "";
  let preview = "";

  let accept = null;
  let reject = null;

  const handleStoreEvent = async () => {
    accept = null;
    reject = null;

    if (wstate === null) {
      navigate(`/sign-in?redirect=${Config.WALLET_STORE}`);
      return;
    }

    const event = await receiveCredentialEvent();
    const { credential } = event;
    const vp = credential.data;
    const vc = Array.isArray(vp.verifiableCredential)
      ? vp.verifiableCredential[0]
      : vp.verifiableCredential;
    preview = JSON.stringify(vp);
    issuer = vc.issuer;
    console.log(credential);

    accept = () => {
      const data = wstate.storage.getItem("data") || [];
      wstate.storage.setItem("data", [...data, credential]);
      event.respondWith(
        Promise.resolve({
          dataType: "VerifiablePresentation",
          data: credential,
        })
      );
    };

    reject = () => event.respondWith(Promise.resolve(null));
  };

  credentialHandlerPolyfill.loadOnce(Config.MEDIATOR).then(handleStoreEvent);
</script>

<div class="container">
  <h1>You have received the following credential:</h1>
  <h2>Issuer: {issuer}</h2>
  <p>{preview}</p>
  <button on:click={accept}>{"Accept"}</button>
  <button on:click={reject}>{"Reject"}</button>
</div>
