<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IM+Fell+DW+Pica" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
</svelte:head>

<style>

  h1, h2 {
    text-align: center;
  }
  h2 {
    font-weight: bold;
  }

  .page {
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
  <h1>Here's your story!</h1>
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
              {#if index == parseInt($currentStoryData.progress)}
                <div class="_spaced _center">
                  <button class="button">Swap image</button>
                </div>
              {/if}
            </div>
          </div>

        </div>

      {/if}

    {/each}

    <div id="imageSelectComponent"></div>

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
