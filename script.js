let chunks = [];
let mediaRecorder;
let isRecording = false;

function startRecording() {
  isRecording = true;
  const videoPlayer = document.getElementById('videoPlayer');
  const overlayText = document.getElementById('overlayText');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fps = 30; // Frames per second
  const interval = 1000 / fps;

  const recordStream = function() {
    if (!isRecording) return;
    canvas.width = videoPlayer.offsetWidth;
    canvas.height = videoPlayer.offsetHeight;
    context.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
    // Draw overlay text
    context.font = '30px Arial';
    context.fillStyle = 'white';
    context.fillText(overlayText.innerText, 20, canvas.height - 20);
    setTimeout(recordStream, interval);
  };

  recordStream();

  mediaRecorder = new MediaRecorder(canvas.captureStream());
  mediaRecorder.ondataavailable = function(event) {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };
  mediaRecorder.onstop = function() {
    const blob = new Blob(chunks, { 'type': 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorded_video.webm';
    document.body.appendChild(a);
    a.click();
    chunks = [];
    URL.revokeObjectURL(url);
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
  };

  mediaRecorder.start();
  document.getElementById('startButton').disabled = true;
  document.getElementById('stopButton').disabled = false;
}

function stopRecording() {
  isRecording = false;
  mediaRecorder.stop();
}