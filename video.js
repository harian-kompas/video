/*jslint vars: true, plusplus: true, devel: true, nomen: true, maxerr: 50, regexp: true, browser:true */

var videos = {
    init : function () {
        'use strict';
        //declare variables first before jslint spank me
        var videoWrapper = document.getElementsByClassName('box-video'),
            vwLen = videoWrapper.length,
            i,
            video,
            controls,
            logo,
            btnFullscreen,
            btnPlay,
            progress,
            progressCurrent,
            volumeWrapper,
            volumeCurrent,
            volumeImg,
            volumeBar;
        
        for (i = 0; i < vwLen; i++) {
            video = videoWrapper[i].getElementsByTagName('video')[0];
            controls = videoWrapper[i].getElementsByClassName('controls')[0];
            logo = document.createElement('img');
            logo.setAttribute('src', 'assets/img/logo_kompas.svg');
            logo.setAttribute('alt', 'Kompas');
            logo.className = 'logo';
            
            btnPlay = document.createElement('img');
            btnPlay.setAttribute('src', 'assets/img/ico_play.svg');
            btnPlay.setAttribute('alt', 'Mainkan');
            btnPlay.setAttribute('title', 'Mainkan');
            btnPlay.className = 'btn-play';
            btnPlay.textContent = 'Main';
            
            progress = document.createElement('input');
            progress.setAttribute('value', 0);
            progress.setAttribute('type', 'range');
            progress.className = 'bar-progress';
            
            progressCurrent = document.createElement('div');
            progressCurrent.style.width = 0;
            progressCurrent.className = 'bar-progress-current';
            
            //HTML5 video's volume has a default value of 1, therefore reduce it to 0.5
            videos.setVolume(-0.5, video);
            
            volumeWrapper = document.createElement('div');
            volumeWrapper.className = 'wrapper-volume';
            volumeCurrent = document.createElement('div');
            volumeCurrent.className = 'volume-current';
            volumeImg = document.createElement('img');
            volumeImg.className = 'normal';
            volumeImg.setAttribute('src', 'assets/img/ico_mute.svg');
            volumeImg.setAttribute('alt', 'volume');
            volumeBar = document.createElement('input');
            volumeBar.setAttribute('value', (video.volume * 100));
            volumeBar.setAttribute('type', 'range');
            volumeBar.setAttribute('min', 0);
            volumeBar.setAttribute('max', 100);
            volumeBar.className = 'bar-volume';
            
            volumeWrapper.appendChild(volumeCurrent);
            volumeWrapper.appendChild(volumeImg);
            volumeWrapper.appendChild(volumeBar);
            
            btnFullscreen = document.createElement('img');
            btnFullscreen.setAttribute('src', './assets/img/ico_fullscreen.svg');
            btnFullscreen.setAttribute('alt', 'Layar penuh');
            btnFullscreen.setAttribute('title', 'Layar penuh');
            
            btnFullscreen.className = 'btn-fullscreen';
           
            
            
            controls.appendChild(logo);
            controls.appendChild(btnPlay);
            controls.appendChild(progressCurrent);
            controls.appendChild(progress);
            controls.appendChild(volumeWrapper);
            controls.appendChild(btnFullscreen);
            
            
            videos.toggleControls(video, controls);
            videos.togglePlay(video, video);
            videos.togglePlay(btnPlay, video);
            videos.setProgress(progress, progressCurrent, video, controls);
            videos.setProgressChange(progress, video);
            videos.setProgressVolume(volumeBar, volumeCurrent, video, volumeImg);
            
            //videos.toggleFullscreen(btnFullscreen, video);
            btnFullscreen.setAttribute('onclick', 'videos.toggleFullscreen(this.parentNode.parentNode)');
            
        }
    },
    togglePlay : function (obj, video) {
        'use strict';
        obj.addEventListener('click', function () {
            var btnPlay = video.parentNode.getElementsByClassName('btn-play');
            
            if (video.paused) {
                video.play();
                btnPlay[0].setAttribute('src', 'assets/img/ico_pause.svg');
            } else {
                video.pause();
                btnPlay[0].setAttribute('src', 'assets/img/ico_play.svg');
            }
        }, false);
    },
    toggleFullscreen : function (box) {
        'use strict';
        var video = box.getElementsByTagName('video')[0];
        //console.log(video.mozRequestFullscreen);
        
        if (!video.fullscreenElement && !video.mozFullScreenElement && !video.webkitFullscreenElement && !video.msFullscreenElement) {
            if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            } else if (video.requestFullscreen) {
                video.requestFullscreen();
            }
        } else {
            if (video.webkitExitFullscreen) {
                video.webkitExitFullscreen();
            } else if (video.mozCancelFullScreen) {
                video.mozCancelFullScreen();
            } else if (video.msExitFullscreen) {
                video.msExitFullscreen();
            } else if (video.exitFullscreen) {
                video.exitFullscreen();
            }
        }
        
    },
    toggleControls : function (video, controls) {
        'use strict';
        /*if (video.paused) {
            if (controls.classList.contains('hidden')) {
                controls.classList.remove('hidden');
            }
        }*/
        
        video.addEventListener('mouseover', function () {
            if (!video.paused) {
                if (controls.classList.contains('hidden')) {
                    controls.classList.remove('hidden');
                }
            }
            
        }, false);
        
        video.addEventListener('mouseout', function () {
            if (!video.paused) {
                if (!controls.classList.contains('hidden')) {
                    controls.classList.add('hidden');
                }
            }
        }, false);
        
        controls.addEventListener('mouseover', function () {
            if (!video.paused) {
                if (controls.classList.contains('hidden')) {
                    controls.classList.remove('hidden');
                }
            }
            
        }, false);
        
        controls.addEventListener('mouseout', function () {
            if (!video.paused) {
                if (!controls.classList.contains('hidden')) {
                    controls.classList.add('hidden');
                }
            }
        }, false);
    },
    setProgress : function (obj, objCurrent, video, controls) {
        'use strict';
        video.addEventListener('timeupdate', function () {
            var percentage = Math.floor((100 / video.duration) * video.currentTime),
                btnPlay = video.parentNode.getElementsByClassName('btn-play');
            obj.value = percentage;
            objCurrent.style.width = percentage + '%';
            if (video.ended) {
                btnPlay[0].setAttribute('src', 'assets/img/ico_play.svg');
                if (controls.classList.contains('hidden')) {
                    controls.classList.remove('hidden');
                }
            }
        }, false);
    },
    setProgressChange : function (obj, video) {
        'use strict';
        obj.addEventListener('change', function () {
            var time = video.duration * (obj.value / 100);
            video.currentTime = time;
        }, false);
    },
    setVolume : function (val, video) {
        'use strict';
        var vol = video.volume;
        vol += val;
        
        if (vol >= 0 && vol <= 1) {
            video.volume = vol;
        } else {
            video.volume = (vol < 0) ? 0 : 1;
        }
    },
    setProgressVolume : function (obj, objCurrent, video, speakerIcon) {
        'use strict';
        obj.addEventListener('change', function () {
            var vol = obj.value / 100;
            objCurrent.style.width = obj.value + '%';
            video.volume = vol;
            if (vol === 0) {
                speakerIcon.className = 'muted';
            } else {
                speakerIcon.className = 'normal';
            }
            //console.log(vol);
        }, false);
    }
};

window.addEventListener('load', videos.init, false);