<script>
  import { Router } from "svelte-navigator";
  import { Body, Footer, Header } from "./ui/container";
</script>

<Router>
  <Header />
  <Body />
  <Footer />
</Router>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  html,
  body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    display: flex;
    flex-direction: column;
  }
</style>
