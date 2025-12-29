<script lang="ts">
  import '../app.css';
</script>

<div class="app-container">
  <slot />
</div>

<style>
  :global(:root) {
    --color-background: #2d1810;
    --color-text: hsl(31, 100%, 80%);
    --color-accent: hsl(40, 100%, 52%);
  }

  :global(body) {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    background: var(--color-background);
    min-height: 100vh;
  }

  .app-container {
    min-height: 100vh;
    padding: 0rem;
    max-width: 1400px;
    margin: 0 auto;
  }
</style>

