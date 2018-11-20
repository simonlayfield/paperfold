<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=Fredoka+One|Work+Sans" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">

</svelte:head>

<header class="app-header">
  <div class="message">Logged in as {$currentUserData.username}</div>
  <div><a href="/illustration">Submit an illustration</a></div>
</header>

<div class="page">

  {#if !$currentUserData.contributions.length && !$currentUserData.complete.length}
    <div class="grey-row">

      <div class="add-section">

        <div>
          <h2 style="text-align: center;">Get started</h2>
          <p>First things first, let's add a Story Title and generate some chapters.</p>

          <form action="/addStory?user=simon" method="POST" class="form-story" autocomplete="off">
            <label for="title">Story Title</label>
            <input type="text" name="title" class="textinput" autofocus>
            {#if $formIsInvalid}
              <div class="validation">^ Add a title</div>
            {/if}
            <button type="submit" class="button">Generate a Story</button>
          </form>
        </div>

      </div>

    </div>
  {:else}

    <h1>Add a new story</h1>

    <div class="add-section">
      <form action="/addStory?user=simon" method="POST" class="form-story"  autocomplete="off">
        <label for="title">Story Title</label>
        <input type="text" name="title" class="textinput" />
        {#if $formIsInvalid}
          <div class="validation">^ Add a title</div>
        {/if}
        <button type="submit">Add Story</button>
      </form>
    </div>

  {/if}

  <div class="story-data">
    {#if $currentUserData.contributions.length}
      <h3>Continue writing</h3>
      <div class="panel-collection">
        {#each Object.entries($currentUserData.contributions) as [object, story]}
          <div class="panel">
            <div class="cover"><a href="/story?id={story.id}"><img src="images/covers/" alt=""></a></div>
            <div class="title"><a href="/story?id={story.id}">{story.title}</a></div>
          </div>
        {/each}
      </div>
    {/if}
    {#if $currentUserData.complete.length}
      <h3>Read previous stories</h3>
      <div class="panel-collection">
        {#each Object.entries($currentUserData.complete) as [object, story]}
          <div class="panel">
            <div class="cover"><a href="/story?id={story._id}"><img src="images/covers/" alt=""></a></div>
            <div class="title"><a href="/story?id={story._id}">{story.title}</a></div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  h1 {
    text-align: center;
  }
  .help {
    text-align: center;
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
    width: 100%;
    max-width: 350px;
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
  .validation {
    color: #C93F54;
  }
  .panel-collection {
    display: grid;
    grid-gap: 30px;
    grid-template-columns: repeat(4, 1fr);
  }
  .panel {
    padding: 2rem;
    background: #1f6fd5;
  }
  .panel a {
    color: #fff;
  }
  .title {
    text-align: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
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
