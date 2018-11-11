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
    .app, .page {
      max-width: 1200px;
      margin: 0 auto;
    }
    img {
      max-width: 100%;
    }
  </style>

</svelte:head>

<header class="app-header">
  <div class="message">Logged in as {$currentUserData.username}</div>
</header>

<div class="page">

  <div class="add-section">
    <form action="/addStory?user=simon" method="POST" class="form-story">
      <label for="title">Story Title</label>
      <input type="text" name="title" class="textinput" />
      {#if $formIsInvalid}
      Form is invalid
      {/if}
      <button type="submit">Add Story</button>
    </form>
  </div>

  <h3>Your stories</h3>

  <div class="story-data">
    <div class="panel-collection">
      {#each Object.entries($currentUserData.contributions) as [object, story]}
        <div class="panel">
          <div class="cover"><a href="/story?id={story.id}"><img src="images/covers/" alt=""></a></div>
          <div class="title"><a href="/story?id={story.id}">{story.title}</a></div>
        </div>
      {/each}
    </div>
  </div>

</div>

<style>
  .app-header {
    background: #66b5c5;
    display: inline-block;
    width: 100%;
    padding: 1rem;
    color: #fff;
  }
  .page {
    padding: 2rem;
  }
  .add-section {
    max-width: 350px;
    margin: 0 auto;
  }
  .form-story {
    margin: 2rem 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .form-story > * {
    margin: 1rem 0;
  }
  .form-story .textinput {
    padding: 1rem;
  }
  .form-story button {
    background: #071D49;
    color: #fff;
    padding: 1rem;
    border: none;
    outline: none;
    border-radius: 3px;
    font-size: 1rem;
  }
  .form-story button:hover {
    background: #172E59;
    cursor: pointer;
  }
  .panel-collection {
    display: grid;
    grid-gap: 30px;
    grid-template-columns: repeat(4, 1fr);
  }
  .panel {
    padding: 2rem;
    border: 1px solid #66b5c5;
  }
  .title {
    text-align: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  .title a {
    color: #666;
  }
</style>

<script>
  export default {
    data() {
      return {
      }
    }
  }
</script>
