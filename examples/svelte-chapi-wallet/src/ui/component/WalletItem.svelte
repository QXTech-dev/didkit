<script lang="ts">
  export let type;
  export let copy;
  export let share;
</script>

<div
  class="block mx-2 my-4 w-full flex flex-row items-center rounded hover:shadow"
>
  <div class="block p-8 text-sm text-bold">{type}</div>
  <div class="w-full mx-4">
    <slot />
  </div>
  <div class="block p-2 flex flex-col">
    <button
      class="text-sm m-1 px-6 py-1 rounded"
      on:click={copy}
      disabled={typeof copy === "undefined" || copy === null}>
      {"Copy"}
    </button>
    <button
      class="text-sm m-1 px-6 py-1 rounded"
      on:click={share}
      disabled={typeof share === "undefined" || share === null}>
      {"Share"}
    </button>
  </div>
</div>
