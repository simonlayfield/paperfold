<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IM+Fell+DW+Pica" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
</svelte:head>

<header class="app-header">
  <div class="message">Logged in as simon</div>
</header>

<div class="page">

  <div class="add-section">
    <h1>The Void thanks you.</h1>
    <p>May you find your worth in the waking world.</p>
    <p><a href="/dashboard">&lsaquo; Head back</a> to the void</p>
  </div>

</div>

<style>

  .page {
    padding: 2rem;
    text-align: center;
  }
  .add-section {
    max-width: 450px;
    margin: 0 auto;
  }
  .hero {
    font-size: 8rem;
    color: #ddd;
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
