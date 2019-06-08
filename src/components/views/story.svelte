<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IM+Fell+DW+Pica" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
</svelte:head>

<style>

  h1 {
    text-align: center;
  }
  #storyField {
    width: 100%;
    border: none;
    outline: none;
    color: #666;
    margin: 3rem 0;
    font-size: 1rem;
    font-family: 'IBM Plex Mono', monospace;
    resize: none;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 50px;
  }
  .chapter-number {
    color: ccc;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
  }
  .caption {
    text-align: center;
    margin-top: 2rem;
    font-style: italic;
  }
  .story-text {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .illustration, .edit {
    border: 1px solid #ddd;
    padding: 2rem;
  }
  .story-image, .story-text {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .edit {
    font-family: 'IBM Plex Mono', monospace;
  }

</style>

  {#if $currentStoryData.progress === 3}

    <div class="app-header">
      <div class="message"><a href="/dashboard">&lsaquo; Back to pictory</a></div>
    </div>

    <h1>{$currentStoryData.title}</h1>


      {#each Object.entries($currentStoryData.chapters) as [object, story], index}
        {#if index === 1}
          <div class="bg">
            <div class="container -split">
              <div class="story-image"><img src="/images/covers/{story.imageSrc}" alt=""><p></div>
              <div class="story-text">{story.text}</div>
            </div>
          </div>
        {:else}
          <div class="container -split">
            <div class="story-text">{story.text}</div>
            <div class="story-image"><img src="/images/covers/{story.imageSrc}" alt=""><p></div>
          </div>
        {/if}

      {/each}

  {:else}

  <div class="app-header">
    <div class="message"><a href="/dashboard">&lsaquo; Back to the void</a> | <span class="header-title">{$currentStoryData.title}</span></div>
  </div>

  <div class="container -split">

    <div class="edit">
      <div class="chapter-number">Chapter {parseInt($currentStoryData.progress) + 1}</div>

      <form action="/addChapterText?id={$currentStoryData._id}" method="POST" id="storyContent">
        {#if $currentStoryData.chapters[$currentStoryData.progress].text}
          <textarea autofocus rows="4" cols="50" name="storyField" id="storyField">
              {$currentStoryData.chapters[$currentStoryData.progress].text}
          </textarea>
        {:else}

          {#if $currentStoryData.progress === "0"}
            <textarea autofocus rows="4" cols="50" name="storyField" id="storyField"
              placeholder="e.g. Once upon a time..."></textarea>
          {:elseif $currentStoryData.progress === "1"}
            <textarea autofocus rows="4" cols="50" name="storyField" id="storyField"
              placeholder="but..."></textarea>
          {:else}
            <textarea autofocus rows="4" cols="50" name="storyField" id="storyField"
              placeholder="and then..."></textarea>
          {/if}

        <p id="characterLimit">
          <small>
          <span id="characterMessage">Character limit:</span>
           <span id="characterNum">200</span>
          </small>
        </p>

        {/if}
        <input type="hidden" name="storyProgress" value="{$currentStoryData.progress}">
        <button type="submit" id="chapterSaveButton">Save</button>
      </form>
      {#if $formIsInvalid}
        <div class="validation">^ Make sure you add chapter text</div>
      {/if}
    </div>

    <div class="illustration">
      <img src="/images/covers/{$currentStoryData.chapters[$currentStoryData.progress].imageSrc}" alt="">
    </div>

  </div>

  {/if}



<script>
  export default {
    data() {
      return {
      }
    }
  }

</script>
