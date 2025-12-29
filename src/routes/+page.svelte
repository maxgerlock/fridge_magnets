<script lang="ts">
  import { onMount } from 'svelte';
  import { cleanWord } from '$lib/utils/text';
  import { loadWordBank } from '$lib/services/wordBankLoader';
  
  let corpusInput = '';
  let words: string[] = [];
  let outputText = '';
  let shuffled = false;
  let showInput = true;
  let isLoading = false;
  let includeShakespeare = true;
  let includeRandom = true;

  function processCorpus() {
    const wordSet = new Set<string>();
    
    corpusInput
      .split(/\s+/)
      .forEach(token => {
        const cleaned = cleanWord(token);
        if (cleaned && cleaned.length > 0) {
          if (!/<[^>]*/.test(cleaned) && !/>/.test(cleaned) && !/&[a-z]+;/.test(cleaned)) {
            wordSet.add(cleaned);
          }
        }
      });
    
    words = Array.from(wordSet).sort();
    shuffled = false;
    showInput = false;
    
    shuffleWords();
  }

  function toggleInput() {
    showInput = !showInput;
  }

  function addWord(word: string) {
    if (outputText) {
      outputText += ' ' + word;
    } else {
      outputText = word;
    }
  }

  function shuffleWords() {
    const shuffledWords = [...words];
    for (let i = shuffledWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
    }
    words = shuffledWords;
    shuffled = true;
  }

  function clearOutput() {
    outputText = '';
  }

  async function loadRandomWords() {
    isLoading = true;
    try {
      corpusInput = await loadWordBank({
        includeShakespeare,
        includeRandom
      });
      processCorpus();
    } catch (error) {
      console.error('Error loading words:', error);
      showInput = true;
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadRandomWords();
  });
</script>

<div class="container">
  <header class="header">
    <h1>Fridge Magnets</h1>
  </header>

  {#if showInput || words.length === 0}
    <div class="input-section">
      {#if isLoading}
        <div class="loading-message">Loading words...</div>
      {:else}
        <div class="word-bank-config">
          <fieldset>
            <legend class="label">Word Bank Sources:</legend>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeShakespeare}
                  on:change={(e) => {
                    includeShakespeare = e.currentTarget.checked;
                  }}
                />
                <span>Shakespeare Words</span>
              </label>
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeRandom}
                  on:change={(e) => {
                    includeRandom = e.currentTarget.checked;
                  }}
                />
                <span>Random Words</span>
              </label>
            </div>
          </fieldset>
          <button 
            class="button button-secondary" 
            on:click={loadRandomWords}
            disabled={!includeShakespeare && !includeRandom}
          >
            Generate Word Bank
          </button>
        </div>
        <label for="corpus-input" class="label">Enter your word bank:</label>
        <textarea
          id="corpus-input"
          class="corpus-input"
          bind:value={corpusInput}
          placeholder="Type words separated by spaces, or paste text here..."
          rows="4"
        ></textarea>
        <button class="button button-primary" on:click={processCorpus}>
          Process Word Bank
        </button>
      {/if}
    </div>
  {/if}

  {#if words.length > 0}
    <div class="split-pane-container">
      <div class="magnets-pane">
        <div class="magnets-header">
          <h2>Word Magnets</h2>
          <button class="button button-secondary" on:click={shuffleWords}>
            Shuffle
          </button>
        </div>
        <div class="magnets-container">
          {#each words as word, index (index)}
            <button
              class="magnet"
              on:click={() => addWord(word)}
              type="button"
            >
              {word}
            </button>
          {/each}
        </div>
        <div class="word-count">
          {words.length} {words.length === 1 ? 'word' : 'words'} in word bank
        </div>
      </div>

      <div class="output-pane">
        <div class="output-header">
          <label for="output-text" class="label">Your Sentence:</label>
          <button class="button button-secondary" on:click={clearOutput}>
            Clear
          </button>
        </div>
        <textarea
          id="output-text"
          class="output-text"
          bind:value={outputText}
          placeholder="Click word magnets to build your sentence, or type directly..."
        ></textarea>
      </div>
    </div>
  {/if}

  {#if !showInput && words.length > 0}
    <div class="input-toggle">
      <button class="button button-link" on:click={toggleInput}>
        Edit Word Bank
      </button>
    </div>
  {/if}
</div>

<style>
  .container {
    background: var(--color-background);
    border-radius: 0;
    padding: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    border: none;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: "Futura", "Gill Sans", "Century Gothic", sans-serif;

  }

  .header {
    text-align: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    position: relative;
  }

  .header h1 {
    background: transparent;
    font-family: "Futura-PT", "Gill Sans", "Century Gothic", sans-serif;
    margin: 0;
    font-size: 4rem;
    color: var(--color-accent);
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    -webkit-text-shadow:0px 0px 20px 12px var(--color-accent);
    -moz-text-shadow: 0px 0px 20px 12px var(--color-accent);
    text-shadow: 0px 0px 20px 12px var(--color-accent);
  }

  .subtitle {
    margin: 0;
    color: var(--color-text);
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 1.0;
  }

  .input-section {
    margin-bottom: 2rem;
  }

  .loading-message {
    text-align: center;
    padding: 2rem;
    color: var(--color-text);
    font-size: 1.1rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .word-bank-config {
    margin-bottom: 1.5rem;
    padding: 1rem;
    border: 1px solid var(--color-text);
    background: var(--color-background);
  }

  .word-bank-config fieldset {
    border: none;
    padding: 0;
    margin: 0 0 1rem 0;
  }

  .word-bank-config legend {
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--color-text);
    font-size: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    color: var(--color-text);
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
  }

  .checkbox-label input[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: var(--color-accent);
  }

  .checkbox-label span {
    user-select: none;
  }

  .input-toggle {
    margin-bottom: 1rem;
    text-align: center;
  }

  .label {
    display: block;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--color-text);
    font-size: 1.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .corpus-input {
    width: 100%;
    padding: 0.875rem;
    border: 1px solid var(--color-text);
    border-radius: 0;
    font-size: 1.1rem;
    font-family: inherit;
    resize: vertical;
    margin-bottom: 1rem;
    transition: all 0.2s;
    background: var(--color-background);
    color: var(--color-text);
    font-weight: 400;
  }

  .corpus-input:focus {
    outline: none;
    border-color: var(--color-accent);
    background: var(--color-background);
  }

  .corpus-input::placeholder {
    color: hsl(31, 100%, 60%);
    opacity: 1;
  }

  .button {
    padding: 0.75rem 1.75rem;
    border: 1px solid var(--color-text);
    border-radius: 0;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .button-primary {
    background: var(--color-text);
    color: var(--color-background);
    border: 1px solid var(--color-text);
  }

  .button-primary:hover {
    background: var(--color-accent);
    color: var(--color-background);
    border-color: var(--color-accent);
  }

  .button-primary:active {
    background: var(--color-text);
    color: var(--color-background);
  }

  .button-secondary {
    background: var(--color-background);
    color: var(--color-text);
    border: 1px solid var(--color-text);
  }

  .button-secondary:hover {
    background: var(--color-text);
    color: var(--color-background);
    border-color: var(--color-text);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button:disabled:hover {
    background: var(--color-background);
    color: var(--color-text);
    border-color: var(--color-text);
  }

  .button-small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    background: var(--color-background);
    color: var(--color-text);
    border: 1px solid var(--color-text);
  }

  .button-small:hover {
    background: var(--color-text);
    color: var(--color-background);
    border-color: var(--color-text);
  }

  .button-link {
    background: transparent;
    color: var(--color-text);
    padding: 0.5rem 1rem;
    font-size: 1rem;
    text-decoration: underline;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: none;
    font-weight: 600;
  }

  .button-link:hover {
    background: var(--color-accent);
    text-decoration: none;
    color: var(--color-background);
  }

  .split-pane-container {
    display: flex;
    gap: 2rem;
    height: calc(100vh - 300px);
    min-height: 500px;
    margin-top: 2rem;
  }

  .magnets-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .magnets-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-shrink: 0;
  }

  .magnets-header h2 {
    margin: 0;
    font-size: 1.75rem;
    color: var(--color-text);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .magnets-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 1.5rem;
    background: var(--color-background);
    border-radius: 0;
    border: 1px solid var(--color-text);
    overflow-y: auto;
    flex: 1;
    align-content: flex-start;
  }

  .word-count {
    margin-top: 1rem;
    text-align: center;
    color: var(--color-text);
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.8;
  }

  .magnet {
    padding: 0.75rem 1.25rem;
    background: var(--color-text);
    color: var(--color-background);
    border: 1px solid var(--color-background);
    border-radius: 0;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    text-transform: none;
    letter-spacing: 0;
  }

  .magnet:hover {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-background);
  }

  .magnet:active {
    background: var(--color-accent);
    opacity: 0.9;
    color: var(--color-background);
  }

  .output-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .output-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-shrink: 0;
  }

  .output-header .label {
    margin-bottom: 0;
    font-size: 1.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .output-text {
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--color-text);
    border-radius: 0;
    font-size: 1.1rem;
    font-family: inherit;
    resize: none;
    background: var(--color-background);
    color: var(--color-text);
    cursor: text;
    font-weight: 400;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  .output-text:focus {
    outline: none;
    border-color: var(--color-accent);
    background: var(--color-background);
  }

  .output-text::placeholder {
    color: hsl(31, 100%, 60%);
    opacity: 1;
  }
</style>

