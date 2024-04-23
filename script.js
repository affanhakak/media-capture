var recorder;
        var videoPlayer = document.getElementById('videoPlayer');
        var startButton = document.getElementById('startButton');
        var stopButton = document.getElementById('stopButton');

        function startRecording() {
            var stream = videoPlayer.captureStream();
            var options = {
                mimeType: 'video/webm',
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 2500000
            };
            recorder = RecordRTC(stream, options);
            recorder.startRecording();
            startButton.disabled = true;
            stopButton.disabled = false;
        }

        function stopRecording() {
            if (recorder && recorder.state === 'recording') {
                recorder.stopRecording(function() {
                    var blob = recorder.getBlob();
                    var videoURL = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = videoURL;
                    a.download = 'recorded-video.webm';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(videoURL);
                    startButton.disabled = false;
                    stopButton.disabled = true;
                });
            }
        }
