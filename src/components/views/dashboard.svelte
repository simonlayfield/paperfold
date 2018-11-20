<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=Fredoka+One|Work+Sans" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">

</svelte:head>

<header class="app-header">
  <div class="message">Logged in as {$currentUserData.username}</div>
  <div><a href="/about">What is The Void?</a> | <a href="/illustration">Submit an illustration</a></div>
</header>

<div class="page">

  {#if !$currentUserData.contributions.length && !$currentUserData.complete.length}
    <div class="grey-row">

      <div class="add-section">

        <div>
          <h2 style="text-align: center;">Commit to the Void</h2>
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

    <h1>Create a new story</h1>

    <div class="add-section">
      <form action="/addStory?user=simon" method="POST" class="form-story" autocomplete="off">
        <label for="title">Story Title</label>
        <input type="text" name="title" class="textinput" autofocus>
        <div><small>Keep it short and sweet...</small></div>
        {#if $formIsInvalid}
          <div class="validation">^ Add a title</div>
        {/if}
        <button type="submit">Add Story</button>
      </form>
    </div>

  {/if}

  <div class="container story-data">
    {#if $currentUserData.contributions.length}
      <h3>Continue writing...</h3>
      <div class="panel-collection">
        {#each Object.entries($currentUserData.contributions) as [object, story]}
          <div class="panel">
            <div class="title">{story.title}</div>
            <div class="links"><a href="/story?id={story.id}">Write</a> | <a href="/toc?id={story.id}">View chapters</a></div>
          </div>
        {/each}
      </div>
    {/if}
    {#if $currentUserData.complete.length}
      <h3>Read previous stories</h3>
      <div class="panel-collection">
        {#each Object.entries($currentUserData.complete) as [object, story]}
          <div class="panel">
            <div class="title">{story.title}</div>
            <div class="links"><a href="/story?id={story._id}">Read</a></div>
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
    background: #000;
    color: #fff;
    padding: 1rem;
    border: none;
    outline: none;
    border-radius: 3px;
    font-size: 1rem;
  }
  .form-story button:hover {
    background: #444;
    cursor: pointer;
  }

  .panel-collection {
    display: grid;
    grid-gap: 30px;
    grid-template-columns: repeat(auto-fill, 200px);
    margin-bottom: 3rem;
  }
  .title {
    padding: 2rem;
    background: #ddd;
    min-height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    text-align: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
    color: #222;
  }
  .links {
    font-size: .8rem;
    margin-top: 7px;
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
