<svelte:head>
  <title>Story</title>
  <link href="https://fonts.googleapis.com/css?family=Fredoka+One" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">

</svelte:head>

<div class="page">

  <div class="logo-section">
<svg width="400px" viewBox="0 0 447 346" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="1.5"><path fill="none" d="M0 0h446.25v345.573H0z"/><text x="593.864" y="433.338" font-family="'UniformRounded-Black','Uniform Rounded'" font-weight="800" font-size="12" transform="matrix(7.92324 0 0 7.50524 -4620.528 -3021.011)">he<tspan x="608.319" y="433.338">y</tspan>ku</text><path d="M274.943 26.28l-21.79 113.201-65.284.4-16.562-63.112 103.636-50.49z" fill="#1f6fd5"/><path d="M669.523 120.641v59.043" fill="none" stroke="#fff" stroke-width="13" transform="rotate(37.46 611.378 -508.4)"/><circle cx="673.853" cy="211.108" r="4.329" fill="#fff" transform="matrix(2.30694 1.76764 -1.76764 2.30694 -949.96 -1595.053)"/><text x="462.323" y="474.469" font-family="'UniformRounded-Black','Uniform Rounded'" font-weight="800" font-size="12" transform="translate(-1234.807 -997.786) scale(2.76402)">tin<tspan x="478.542" y="474.469">y</tspan> illus<tspan x="511.975px 517.495px 522.27px 528.809px 534.212px" y="474.469px 474.469px 474.469px 474.469px 474.469px">trate</tspan>d s<tspan x="558.258px 563.661px" y="474.469px 474.469px">to</tspan>ries</text></svg>
  </div>

</div>

<div class="blue-row">
  <div class="content-section">
    <div class="grid">
      <div>
        <h2>How does it work?</h2>
        <p>Heyku is a teensy tool for generating short stories made up of three chapters of no more than 200 characters each.</p>
        <p>Each chapter gives you a title, illustration and caption.</p>
        <p>Try to incorporate what you see in the illustration in to the story.</p>
      </div>
      <div>
        <a href="/dashboard" class="button">Let's Go!</a>
      </div>
    </div>
  </div>
</div>

<style>
  .page {
    padding: 2rem;
    text-align: center;
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
