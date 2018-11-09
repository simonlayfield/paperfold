<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,400i,700,700i" rel="stylesheet">
  <link href="main.css" rel="stylesheet">
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

<div class="page">

  <div class="user-info">
    <div class="username">Username: {$currentUserData.username}</div>
    <div class="add">
      <form action="/addStory?user=simon" method="POST">
        <input type="text" name="title" />
        <button type="submit">Add Story</button>
      </form>
    </div>
  </div>

  <h3>Stories</h3>

  <div class="story-data">
    <div class="panel-collection">
      {#each Object.entries($currentUserData.contributions) as [object, story]}
        <div class="panel">
          <div class="cover"><a href="/story?id={story.id}"><img src="images/covers/Cover-{story.title.replace(/ /g, '-')}.jpg" alt=""></a></div>
          <div class="title"><a href="/story?id={story.id}">{story.title}</a></div>
        </div>
      {/each}
    </div>
  </div>

</div>

<style>
  .username {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .add {
    margin: 2rem 0;
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
