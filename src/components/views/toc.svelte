<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,400i,700,700i" rel="stylesheet">
  <link href="/css/main.css" rel="stylesheet">
</svelte:head>

<style>

  h1, h2 {
    text-align: center;
  }
  h2 {
    font-weight: bold;
  }

  .page, .illustration {
    padding: 2rem;
  }
  .page {
    text-align: center;
  }
  .illustration {
    border-left: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .caption {
    text-align: center;
    padding-top: 1rem;
    font-size: .9rem;
    font-style: italic;
  }
  .chapter, .title {
    font-weight: bold;
    padding-top: 1rem;
  }
  .chapter {
    color: #999;
  }

</style>

  <div class="app-header">
    <div class="message"><a href="/dashboard">&lsaquo; Back to paperfold</a> | {$currentStoryData.title}</div>
  </div>

  <div class="container">
    <h1>Here's your story!</h1>
  </div>

<div class="grey-row">
  <div class="container -slim">

    <div class="container">
      <h2>{$currentStoryData.title}</h2>
    </div>

    {#each Object.entries($currentStoryData.chapters) as [object, chapter], index}
      <div class="two spread">
        <div class="page">
          <div class="chapter">Chapter {index+1}</div>
          <div class="title">{chapter.title}</div>
        </div>
        <div class="illustration">
          <div>
            <img src="/images/covers/{chapter.imageSrc}" width="300px" alt="">
            <div class="caption">{chapter.caption}</div>
          </div>
        </div>
      </div>
    {/each}

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
