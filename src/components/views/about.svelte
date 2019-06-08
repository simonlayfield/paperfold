<svelte:head>
  <title>About | Pictory</title>
  <link href="https://fonts.googleapis.com/css?family=IM+Fell+DW+Pica" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
</svelte:head>

<header class="app-header">
  <div class="message">Logged in as simon</div>
</header>

<div class="page">

  <div class="add-section">
    <h1>What is Pictory?</h1>
    <p>Abstract images, by nature, are open to interpretation. Two different people may look at the same composition and see and connect with totally different aspects.</p>
    <p><strong>Pictory</strong> is an experiment that encourages public contributions to short stories, fueled by the mystery and suspense of purposefully composed abstract ink compositions.</p>
    <!-- <p>By challenging and exploring our imaginations we </p> -->
    <p><a class="button" href="/dashboard">&lsaquo; Head back to pictory</a></p>
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
</style>

<script>
  export default {
    data() {
      return {
      }
    }
  }
</script>
