
let fileSelectInput = document.getElementById('cover'),
    storyField = document.getElementById('storyField'),
    charLimit = document.getElementById('characterLimit'),
    charNum = document.getElementById('characterNum'),
    charMessage = document.getElementById('characterMessage'),
    chapterSaveButton = document.getElementById('chapterSaveButton');

if (fileSelectInput) {
  fileSelectInput.addEventListener('change', function() {
    document.getElementById('coverLabel').innerHTML = 'File selected &check;';
  });
}

if (storyField) {
  storyField.addEventListener('keyup', function(e) {
    charNum.innerText = 100 - e.target.value.length;
    if (e.target.value.length > 100) {
      charLimit.classList.add('validation');
      chapterSaveButton.disabled = true;
      characterMessage.innerText = 'Too many characters...';
    } else {
      charLimit.classList.remove('validation');
      characterMessage.innerText = 'Character Limit:';
      chapterSaveButton.disabled = false;
    }
  });
}
