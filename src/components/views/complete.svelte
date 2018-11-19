<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=Fredoka+One" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
</svelte:head>

<header class="app-header">
  <div class="message">Logged in as </div>
</header>

<div class="page">

  <div class="add-section">
    <div class="hero">&#9786;</div>
    <h1>Great! All done.</h1>
    <p><a href="/dashboard">&lsaquo; Head back</a> to heyku</p>
  </div>

</div>

<style>

  .page {
    padding: 2rem;
    text-align: center;
  }
  .page a {
    color: #1f6fd5;
  }
  .add-section {
    max-width: 350px;
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
