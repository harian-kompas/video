/*jslint vars: true, plusplus: true, devel: true, nomen: true, maxerr: 50, regexp: true, browser:true */
var videos = (function () {
	'use strict';
	var iconsPath = './assets/img/',
        togglePlay = function (obj, button, video) {

            var fn = function () {
                if (video.paused) {
                    video.play();
                    button.setAttribute('src', iconsPath + 'ico_pause.svg');
                } else {
                    video.pause();
                    button.setAttribute('src', iconsPath + 'ico_play.svg');
                }
            };

            obj.addEventListener('click', fn, false);
        },
        toggleFullscreen = function (button, video) {

            //var video = box.getElementsByTagName('video')[0];
            var fn = function () {
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
            };
            button.addEventListener('click', fn, false);
        },
        toggleControls = function (video, controls) {

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
        setProgress = function (obj, objCurrent, video, controls) {

            var fn = function () {
                var percentage = Math.floor((100 / video.duration) * video.currentTime),
                    btnPlay = video.parentNode.getElementsByClassName('btn-play');
                obj.value = percentage;
                objCurrent.style.width = percentage + '%';
                if (video.ended) {
                    btnPlay[0].setAttribute('src', iconsPath + 'ico_play.svg');
                    if (controls.classList.contains('hidden')) {
                        controls.classList.remove('hidden');
                    }
                }
            };

            video.addEventListener('timeupdate', fn, false);
        },
        setProgressChange = function (obj, video) {

            var fn = function () {
                var time = video.duration * (obj.value / 100);
                video.currentTime = time;
            };

            obj.addEventListener('change', fn, false);
        },
        setVolume = function (val, video) {

            var vol = video.volume;
            vol += val;

            if (vol >= 0 && vol <= 1) {
                video.volume = vol;
            } else {
                video.volume = (vol < 0) ? 0 : 1;
            }
        },
        setProgressVolume = function (obj, objCurrent, video, speakerIcon) {

            var fn = function () {
                var vol = obj.value / 100;
                objCurrent.style.width = obj.value + '%';
                video.volume = vol;
                speakerIcon.className = (vol === 0) ? 'muted' : 'normal';
            };

            obj.addEventListener('change', fn, false);
        },
        init = function () {

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
                volumeBar,
                w,
                h;

            for (i = 0; i < vwLen; i++) {
                video = videoWrapper[i].getElementsByTagName('video')[0];
                controls = videoWrapper[i].getElementsByClassName('controls')[0];
                w = videoWrapper[i].offsetWidth;
                h = videoWrapper[i].offsetHeight;
                console.log('w: ' + w + ' h: ' + h);
                
                video.setAttribute('width', w);
                video.setAttribute('height', h);
                
                logo = document.createElement('img');
                logo.setAttribute('src', iconsPath + 'logo_kompas.svg');
                logo.setAttribute('alt', 'Kompas');
                logo.className = 'logo';

                btnPlay = document.createElement('img');
                btnPlay.setAttribute('src', iconsPath + 'ico_play.svg');
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
                setVolume(-0.5, video);

                volumeWrapper = document.createElement('div');
                volumeWrapper.className = 'wrapper-volume';
                volumeCurrent = document.createElement('div');
                volumeCurrent.className = 'volume-current';
                volumeImg = document.createElement('img');
                volumeImg.className = 'normal';
                volumeImg.setAttribute('src', iconsPath + 'ico_mute.svg');
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
                btnFullscreen.setAttribute('src', iconsPath + 'ico_fullscreen.svg');
                btnFullscreen.setAttribute('alt', 'Layar penuh');
                btnFullscreen.setAttribute('title', 'Layar penuh');

                btnFullscreen.className = 'btn-fullscreen';

                controls.appendChild(logo);
                controls.appendChild(btnPlay);
                controls.appendChild(progressCurrent);
                controls.appendChild(progress);
                controls.appendChild(volumeWrapper);
                controls.appendChild(btnFullscreen);


                toggleControls(video, controls);
                togglePlay(video, btnPlay, video);
                togglePlay(btnPlay, btnPlay, video);
                setProgress(progress, progressCurrent, video, controls);
                setProgressChange(progress, video);
                setProgressVolume(volumeBar, volumeCurrent, video, volumeImg);
                toggleFullscreen(btnFullscreen, video);

            }
        };

    return {init : init};
}());

window.addEventListener('load', videos.init, false);