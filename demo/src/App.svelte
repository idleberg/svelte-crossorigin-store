<script lang="ts">
  import { Column, Grid, Row } from "carbon-components-svelte";
  import Main from './lib/Main.svelte';
  import Iframe from './lib/Iframe.svelte';
</script>       

{#if PAGE_TYPE === 'main'}
  <Grid fullWidth>
    <Row>
      <Column padding>
        <h1>Demo Page</h1>
        <p>Change the counter in any of these origins to see the state being synched.</p>
      </Column>
    </Row>

    <Row>
      <Column padding>
        <Main />
      </Column>
    </Row>

    <Row>     
      <Column padding>
          <iframe frameborder="0" src="https://localhost:3031" title="iFrame #1" />
      </Column>
    </Row>

    <Row>
      <Column padding>
        <iframe frameborder="0" src="https://localhost:3032" title="iFrame #2" />
      </Column>
    </Row>
  </Grid>
{/if}

{#if PAGE_TYPE === 'iframe'}
  <svelte:component this={Iframe} />
{/if}

<style>
  iframe {
    width: 100%;
    height: 150px;
  }
</style>