<svelte:head>
  <title>Add an illustration to Pictory</title>
  <link href="https://fonts.googleapis.com/css?family=IM+Fell+DW+Pica" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">

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
  </style>

<div class="app-header">
  <div class="message"><a href="/dashboard">&lsaquo; Back to pictory</a></div>
</div>

<div class="page">
  <h1>Submit images to Pictory</h1>
  <p class="_center">Or just upload your work if you so wish.</p>

  <div class="add-section">
    <form action="/upload" method="post" enctype="multipart/form-data" class="form-illustration" autocomplete="off">
      <label for="cover" class="fileinput-label" id="coverLabel">
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
