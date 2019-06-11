<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IM+Fell+DW+Pica" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
</svelte:head>

<style>

  h1 {
    text-align: center;
  }

  .page {
    padding: 2rem;
    text-align: center;
  }
  .illustration {
    border-left: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .chapter {
    font-weight: bold;
    padding-top: 1rem;
    color: #999;
    font-family: 'IM Fell DW Pica', serif;
  }

</style>

<div class="app-header">
  <div class="message">
    <a href="/dashboard">&lsaquo; Back to the void</a> <span class="divider">|</span>
    <div id="textEditComponent"></div>
  </div>
</div>

<div class="container">
  {#if $currentStoryData.chapters == 0}
    <h1>Let's add some chapters...</h1>
  {:else}
      <h1>Here's your story!</h1>
  {/if}
</div>

<div class="grey-row">
  <div class="container -slim">

    {#each Object.entries($currentStoryData.chapters) as [object, chapter], index}

      {#if chapter.confirmed}

        <div class="two spread">

          <div class="page">

            <div class="chapter">Chapter {index+1}</div>

            {#if index < $currentStoryData.progress}

              <p>{$currentStoryData.chapters[index].text}</p>

            {:elseif index == parseInt($currentStoryData.progress)}

              <div class="_spaced">
                <a href="/story?id={$currentStoryData._id}" class="button">Write Chapter {index+1}</a>
              </div>

            {/if}

          </div>

          <div class="illustration">
            <div>
              <img src="/images/covers/{chapter.imageSrc}" width="300px" alt="">
            </div>
          </div>

        </div>

      {/if}

    {/each}

    <div class="_centered">
      <div id="imageSelectComponent"></div>
    </div>

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
