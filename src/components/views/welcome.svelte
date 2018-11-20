<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=Fredoka+One" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">

</svelte:head>

<div class="page">

  <div class="logo-section">
    <img src="/images/logo-void.png" srcset="/images/logo-void@2x.png 2x" alt="">
  </div>

</div>

<div class="blue-row">
  <div class="content-section">
    <div class="grid">
      <div>
        <h2>What madness is this?</h2>
        <p>A picture tells a thousand words; that's too many.</p>
        <p>The Void is a way of creating short stories from sunspenseful, abstract illustrations.</p>
        <div class="cta">
          <a href="/dashboard" class="button">Venture forth</a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .page {
    padding: 2rem;
    text-align: center;
  }

  .cta {
    margin-top: 2rem;
  }

  .add-section, .content-section {
    margin: 4rem auto;
  }
  .add-section {
    max-width: 350px;
    margin: 3rem auto;
  }
  .content-section {
    max-width: 800px;
  }
  .logo-section {
    margin: 0 auto;
  }
  .hero {
    font-size: 8rem;
    color: #ddd;
  }
  .grid {
    display: flex;
    justify-content: center;
    margin-top: 5rem;
    margin-bottom: 3rem;
  }
  grid.-padded > * {
    margin-left: 2rem;
    margin-right: 2rem;
  }
  .grid > * {
    width: 50%;
    text-align: center;
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
