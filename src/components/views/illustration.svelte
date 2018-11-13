<svelte:head>
  <title>Add an illustration to Paperfold</title>
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

<style>
  h1 {
    text-align: center;
  }
  .app-header {
    background: #66b5c5;
    display: inline-block;
    width: 100%;
    padding: 1rem;
    color: #fff;
  }
  .app-header a {
    color: #fff;
  }
  .page {
    padding: 2rem;
  }
  .add-section {
    max-width: 350px;
    margin: 0 auto;
  }
  .form-illustration {
    margin: 2rem 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .form-illustration > * {
    margin: 1rem 0;
  }
  .form-illustration .textinput {
    padding: 1rem;
  }
  .form-illustration button {
    background: #071D49;
    color: #fff;
    padding: 1rem;
    border: none;
    outline: none;
    border-radius: 3px;
    font-size: 1rem;
  }
  .form-illustration button:hover {
    background: #172E59;
    cursor: pointer;
  }
  .validation {
    color: #C93F54;
  }

</style>

<div class="app-header">
  <div class="message"><a href="/">&lsaquo; Back to paperfold</a></div>
</div>

<div class="page">
  <h1>Submit illustrations to paperfold</h1>

  <div class="add-section">
    <form action="/upload" method="post" enctype="multipart/form-data" class="form-illustration">
      <input type="file" name="cover" />
      <label for="title">Title</label>
      <input type="text" name="title" id="title" class="textinput" />
      <label for="caption">Caption</label>
      <input type="text" name="caption" id="caption" class="textinput" />
      <button tye="submit">Submit</button>
    </form>
  </div>

</div>

<script>
  export default {
    data() {
      return {

      }
    }
  };
</script>
