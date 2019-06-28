<svelte:head>
  <title>Pictory | Tiny Illustrated Stories</title>
  <link href="https://fonts.googleapis.com/css?family=IM+Fell+DW+Pica" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
</svelte:head>

<div class="page">

  <div class="logo-section">
    <img src="/images/logo-pictory.jpg" srcset="/images/logo-pictory@2x.jpg 2x" alt="">
  </div>

</div>

<div class="blue-row">
    <div class="grid">
      <div>
        <h2>What is pictory?</h2>
        <p>Pictory is a way of creating short stories from sunspenseful, abstract illustrations.</p>
        <div class="cta">
          <a href="/dashboard" class="button">Get started</a>
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

  .content-section {
    max-width: 800px;
  }
  .logo-section {
    margin: 0 auto;
  }
  .grid {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
  .grid > * {
    max-width: 400px;
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
