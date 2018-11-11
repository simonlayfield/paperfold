<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,400i,700,700i" rel="stylesheet">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      font-family: 'IBM Plex Mono', monospace;
    }
    .app {
      max-width: 1200px;
      margin: 0 auto;
    }
    img {
      max-width: 100%;
    }
  </style>

</svelte:head>

<style>
  .app-header {
    background: #66b5c5;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 1rem;
    color: #fff;
    margin-bottom: 4rem;
  }
  .app-header a {
    color: #fff;
  }
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
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 50px;
  }
  button {
    background: #000;
    color: #fff;
    border: none;
    outline: none;
    font-size: 1rem;
    padding: 1rem;
    cursor: pointer;
    transition: background .1s linear;
  }
  button:hover {
    background: #666;
  }
  .caption {
    text-align: center;
    margin-top: 2rem;
  }
</style>

<div class="app-header">
  <div class="message">{$currentStoryData.title}</div>
</div>

<div class="container -split">

  <div class="edit">
    <h2>Chapter {$currentStoryData.progress + 1}</h2>
    <h2>{$currentStoryData.chapters[$currentStoryData.progress].title}</h2>
    <form action="/addChapterText?id={$currentStoryData._id}" method="POST" id="storyContent">
      {#if $currentStoryData.chapters[$currentStoryData.progress].text}
        <textarea autofocus rows="4" cols="50" name="storyField" id="storyField">
            {$currentStoryData.chapters[$currentStoryData.progress].text}
        </textarea>
      {:else}
        <textarea autofocus rows="4" cols="50" name="storyField" id="storyField"
          placeholder="start writing..." value=""></textarea>
      {/if}
      <div id="character-count"></div>
      <input type="hidden" name="storyProgress" value="{$currentStoryData.progress}">
      <button type="submit">Save</button>
    </form>
  </div>

  <div class="illustration">
    <img src="/images/covers/{$currentStoryData.chapters[$currentStoryData.progress].imageSrc}" alt="">
    <p class="caption">{$currentStoryData.chapters[$currentStoryData.progress].caption}</p>
  </div>

</div>

<script>
  export default {
    data() {
      return {
      }
    }
  }

</script>
