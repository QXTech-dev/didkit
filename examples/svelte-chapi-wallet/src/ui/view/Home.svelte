<script lang="ts">
  import { Link } from "svelte-navigator";
  import { registerWallet } from "../../chapi.ts";

  const onClick = (event) => {
    event.preventDefault();
    registerWallet();
  };

  const linkStyle =
    "text-sm font-medium text-center " +
    "visited:text-black hover:no-underline " +
    "border border-gray-300 rounded " +
    "w-full px-4 py-2 my-1";
</script>

<div
  class="flex flex-col justify-center container w-1/3 shadow rounded mx-auto my-8 px-3 py-4"
>
  <Link class={linkStyle} to="/sign-in">
    {"Sign In"}
  </Link>
  <Link class={linkStyle} to="/sign-up">
    {"Sign Up"}
  </Link>
  <a class={linkStyle} href={"#"} on:click={onClick}>
    {"Register Wallet"}
  </a>
</div>
