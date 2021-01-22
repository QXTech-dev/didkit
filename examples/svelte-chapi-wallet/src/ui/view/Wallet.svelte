<script lang="ts">
  import { walletState } from "../../store.ts";
  import { WalletItem } from "../component";
  import { copyToClipboard } from "../../utils.ts";
  import { parseISO, formatDistanceToNow } from "date-fns";

  let wstate;
  walletState.subscribe((value) => {
    wstate = value;
  });
</script>

<div class="container mx-auto my-8 px-6 py-4 shadow">
  {#if wstate !== null}
    <h1 class="text-xl text-black">{wstate.username}'s wallet</h1>
    <h2 class="text-sm text-gray-500">
      Here you can view your DIDs, Credentials.
    </h2>

    <div class="mt-8">
      {#if wstate.storage.getItem("data") !== null}
        {#each wstate.storage.getItem("data") as item}
          <WalletItem
            type={item?.dataType}
            copy={() => copyToClipboard(JSON.stringify(item))}
          >
            {#if item?.dataType === "VerifiablePresentation"}
              {#each item?.data?.verifiableCredential as vc}
                <p class="text-md">
                  <span class="font-bold">{"ID: "}</span>
                  <span class="text-xl">{vc?.id}</span>
                </p>
                <p class="text-md">
                  <span class="font-bold">{"Issuer: "}</span>
                  <span class="text-xl" alt={vc?.issuanceDate}>
                    {vc?.issuer +
                      " (" +
                      formatDistanceToNow(parseISO(vc?.issuanceDate), {
                        addSuffix: true,
                      }) +
                      ")"}
                  </span>
                </p>
                <p class="text-md">
                  <span class="font-bold">{"Subject: "}</span>
                  <span class="text-xl">{vc?.credentialSubject?.id}</span>
                </p>
              {/each}
            {:else}
              <span class="text-xl">
                {JSON.stringify(item?.data)}
              </span>
            {/if}
          </WalletItem>
        {/each}
      {:else}
        <div class="px-8 py-2 my-4 text-sm bg-yellow-50 rounded">
          {"Your wallet is empty"}
        </div>
      {/if}
    </div>
  {:else}
    <div class="px-8 py-2 my-4 text-sm bg-red-50 rounded">
      {"This page is only accessible to authenticated users."}
    </div>
  {/if}
</div>
