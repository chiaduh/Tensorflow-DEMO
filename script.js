const video = document.getElementById('video')
canvas = document.getElementById('canvas');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

//Chia: Face Detection
video.addEventListener('playing', () => {
  const facecanvas = faceapi.createCanvasFromMedia(video)
  document.body.append(facecanvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(facecanvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const test = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    facecanvas.getContext('2d').clearRect(0, 0, facecanvas.width, facecanvas.height)
    faceapi.draw.drawDetections(facecanvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(facecanvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(facecanvas, resizedDetections)
  }, 1000)
})

//Chia: Download Canvas as .PNG
var download = function(){
  var link = document.createElement('a');
  link.download = 'Test.png';
  link.href = document.getElementById('canvas').toDataURL()
  link.click();
  }

  //Chia: Take Picture
  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        download();
        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    } else {
        clearphoto();
    }
}

//Chia: Clean Canvas after Taking Photo
function clearphoto() {
  var context = canvas.getContext('2d');
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}


//Chia: Take picture & Clean Canvas if Click Button
startbutton.addEventListener('click', function(ev) {
  takepicture();
  ev.preventDefault();
}, false);