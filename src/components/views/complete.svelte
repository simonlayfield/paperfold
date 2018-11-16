<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,400i,700,700i" rel="stylesheet">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      font-family: 'IBM Plex Mono', monospace;
    }
    .app, .page {
      max-width: 1200px;
      margin: 0 auto;
    }
    img {
      max-width: 100%;
    }
  </style>

</svelte:head>

<header class="app-header">
  <div class="message">Logged in as </div>
</header>

<div class="page">

  <div class="add-section">
    <div class="hero">&#9786;</div>
    <h1>Great! All done.</h1>
    <p><a href="/dashboard">&lsaquo; Head back</a> to paperfold</p>
    <p>- or -</p>
    <p><a href="/illustration">Submit another illustration</p>
  </div>

</div>

<style>
  .app-header {
    background: #66b5c5;
    display: inline-block;
    width: 100%;
    padding: 1rem;
    color: #fff;
  }
  .page {
    padding: 2rem;
    text-align: center;
  }
  .page a {
    color: #66b5c5;
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
