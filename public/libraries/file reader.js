fileInput.addEventListener('change', function(e) {
  var file = fileInput.files[0];
  var textType = /text.*/;
  if (file.type.match(textType)) {
    var reader = new FileReader();
    reader.onload = function(e) {
      console.log(reader.result);
    }
    reader.readAsText(file);
  } else {
    fileDisplayArea.innerText = "File not supported!"
  }
});
}
