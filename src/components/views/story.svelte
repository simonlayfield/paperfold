<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,400i,700,700i" rel="stylesheet">
  <link href="/css/main.css" rel="stylesheet">
</svelte:head>

<style>

  h1, h2 {
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
  .edit, .edit h1, .edit h2 {
    font-family: 'IBM Plex Mono', monospace;
  }
  .message a {
    margin-right: 2rem;
  }
</style>

  {#if $currentStoryData.progress === 3}

    <div class="app-header">
      <div class="message"><a href="/dashboard">&lsaquo; Back to paperfold</a></div>
    </div>

    <h1>{$currentStoryData.title}</h1>

    <div class="container -split">
      {#each Object.entries($currentStoryData.chapters) as [object, story], index}

        {#if index === 1}
          <div class="story-image"><img src="/images/covers/{story.imageSrc}" alt=""><p></div>
          <div class="story-text">{story.text}</div>
        {:else}
          <div class="story-text">{story.text}</div>
          <div class="story-image"><img src="/images/covers/{story.imageSrc}" alt=""><p></div>
        {/if}

      {/each}
    </div>
  {:else}

  <div class="app-header">
    <div class="message"><a href="/dashboard">&lsaquo; Back to paperfold</a> | {$currentStoryData.title}</div>
  </div>

  <div class="container -split">

    <div class="edit">
      <div class="chapter-number">Chapter {parseInt($currentStoryData.progress) + 1}</div>
      <h2>{$currentStoryData.chapters[$currentStoryData.progress].title}</h2>

      {#if $currentStoryData.progress === "0"}
        <p>Once upon a time...</p>
      {:elseif $currentStoryData.progress === "1"}
        <p>but...</p>
      {:else}
        <p>and then...</p>
      {/if}
      <form action="/addChapterText?id={$currentStoryData._id}" method="POST" id="storyContent">
        {#if $currentStoryData.chapters[$currentStoryData.progress].text}
          <textarea autofocus rows="4" cols="50" name="storyField" id="storyField">
              {$currentStoryData.chapters[$currentStoryData.progress].text}
          </textarea>
        {:else}
          <textarea autofocus rows="4" cols="50" name="storyField" id="storyField"
            placeholder="start writing..."></textarea>
        <!-- <div>{$currentStoryData.chapters[$currentStoryData.progress].text}</div>
        <div id="character-count"></div> -->
        {/if}
        <input type="hidden" name="storyProgress" value="{$currentStoryData.progress}">
        <button type="submit">Save</button>
      </form>
      {#if $formIsInvalid}
        <div class="validation">^ Make sure you add chapter text</div>
      {/if}
    </div>

    <div class="illustration">
      <img src="/images/covers/{$currentStoryData.chapters[$currentStoryData.progress].imageSrc}" alt="">
      <p class="caption">{$currentStoryData.chapters[$currentStoryData.progress].caption}</p>
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
