<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,400i,700,700i" rel="stylesheet">
  <link href="main.css" rel="stylesheet">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      font-family: 'IBM Plex Mono', monospace;
    }
    .app {
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
    color: red;
  }
  .storyPage {
    width: 100%;
    border: none;
    outline: none;
    color: #666;
    margin: 3rem 0;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 50px;
  }
  button {
    background: #000;
    color: #fff;
    border: none;
    outline: none;
    font-size: 1rem;
    padding: 1rem;
    cursor: pointer;
    transition: background .1s linear;
  }
  button:hover {
    background: #666;
  }
  </style>

  <div class="container -split">
    <div class="edit">
      <h1>{$currentStoryData.title}</h1>

      <div class="storyPage" id="storyEdit" contenteditable>{storyText}</div>
      <form hidden action="/storySubmission" method="POST" id="storyContent">
        <textarea rows="4" cols="50" name="storyField" id="storyField" value="{storyText}"></textarea>
      </form>
      <button type="submit" on:click="submit()">Save</button>
    </div>
    <div class="illustration">
      <img src="" alt="">
    </div>
  </div>

  <script>
    export default {
      data() {
        return {
          storyText: "It was raining heavily..."
        }
      },
      computed: {

      },
      methods: {
        submit() {
          const storyEdit = document.getElementById("storyEdit"),
                storyField = document.getElementById("storyField"),
                storyContent = document.getElementById("storyContent");
          this.set({story: storyEdit.innerHTML})
          storyContent.submit();
        }
      }
    }
  </script>
