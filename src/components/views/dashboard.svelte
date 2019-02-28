<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IM+Fell+DW+Pica" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">

</svelte:head>

<header class="app-header">
  <div class="message">Logged in as {$currentUserData.username}</div>
  <div class="link-list">
    <a class="link" href="/about">What is The Void?</a>
    <a class="link button" href="/illustration">Submit an illustration</a>
  </div>
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
            <button type="submit" class="button">Create a new  story</button>
          </form>
        </div>

      </div>

    </div>
  {:else}

    <div class="add-section">
      <form action="/addStory?user=simon" method="POST" class="form-story" autocomplete="off">
        <button class="button -outline" type="submit">Start a new story</button>
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
            <div class="links">
              <a class="button -small" href="/toc?id={story.id}">Edit</a>
              <form action="/deleteStory/{story.id}" method="post"><button class="button -small -outline" type="submit">Delete</button></form></div>

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
            <div class="links"><a class="button -small" href="/story?id={story._id}">Read</a></div>
          </div>
        {/each}
      </div>
    {/if}
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
