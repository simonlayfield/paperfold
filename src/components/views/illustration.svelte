<svelte:head>
  <title>Add an illustration to The Void</title>
  <link href="https://fonts.googleapis.com/css?family=Fredoka+One|Work+Sans" rel="stylesheet">
  <link href="/css/main.css" rel="stylesheet">

</svelte:head>

<style>
  h1 {
    text-align: center;
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
    margin: .5rem 0;
  }
  .form-illustration .textinput {
    padding: 1rem;
    outline: none;
    border: 1px solid #ddd;
  }
  .form-illustration .textinput:focus {
    outline: none;
    border: 1px solid #66b5c5;
  }

  .validation {
    color: #C93F54;
  }
  .fileinput {
    display: none;
  }
  .fileinput-label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border: 1px solid #000;
    cursor: pointer;
  }
  .fileinput-label > * {
    margin-left: 1rem;
  }
  .fileinput-label svg {
    margin-left: 0;
  }

  </style>

<div class="app-header">
  <div class="message"><a href="/dashboard">&lsaquo; Back to the void</a></div>
</div>

<div class="page">
  <h1>Forfeit your soul to The Void</h1>
  <p class="_center">Or just upload your work if you so wish.</p>

  <div class="add-section">
    <form action="/upload" method="post" enctype="multipart/form-data" class="form-illustration" autocomplete="off">
      <label for="cover" class="fileinput-label" id="coverLabel">
        <!-- <svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"/></svg> -->
        <span>Select a file...</span>
      </label>
      <input type="file" name="cover" id="cover" class="fileinput">
      <label for="title">Add a title for your image</label>
      <input type="text" name="title" id="title" class="textinput" placeholder="e.g. The Perfect Day">
      <label for="caption">Add a caption</label>
      <input type="text" name="caption" id="caption" class="textinput" placeholder="e.g. The sun rose over the hills">
      <div><small>This helps give context</small></div>
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
