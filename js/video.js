/*jslint vars: true, plusplus: true, devel: true, nomen: true, maxerr: 50, regexp: true, browser:true */

var videos = (function () {
    'use strict';
    var objects = {
            videoWrappers : document.getElementsByClassName('box-video')
        },
        humanReadableDuration = function (intDuration) {
            var h,
                m,
                s,
                hour = Math.floor(intDuration / 3600),
                min = Math.floor((intDuration - (hour * 3600)) / 60),
                sec = Math.floor(intDuration - (hour * 3600) - (min * 60));
            
            if (hour > 0) {
                h = (hour < 1) ? '0' + hour : hour;
                h += ':';
            } else {
                h = '';
            }
            m = (min < 10) ? '0' + min : min;
            s = (sec < 10) ? '0' + sec : sec;
            return h + m + ':' + s;
        },
        setInitialDuration = function (barTime, video) {
            var fn = function () {
                barTime.textContent = humanReadableDuration(video.duration);
            };
            video.addEventListener('loadedmetadata', fn, false);
        },
        setProgress = function (progressCurrent, progressInput, video, btnPlay, barTime, controls) {
            var percentage,
                fn = function () {
                    percentage = Math.floor((100 / video.duration) * video.currentTime);
                    progressCurrent.style.width = percentage + '%';
                    progressInput.value = percentage;
                    barTime.textContent = humanReadableDuration(video.duration - video.currentTime);
                    
                    if (video.ended) {
                        btnPlay.classList.remove('pause');
                        btnPlay.classList.add('replay');
                        btnPlay.setAttribute('title', 'Putar ulang');
                        
                        if (controls.classList.contains('hidden')) {
                            controls.classList.remove('hidden');
                        }
                    }
                };
            video.addEventListener('timeupdate', fn, false);
        },
        setProgressChange = function (progressInput, video) {
            var time,
                fn = function () {
                    time = video.duration * (progressInput.value / 100);
                    video.currentTime = time;
                };
            
            progressInput.addEventListener('change', fn, false);
        },
        setVolume = function (val, video) {
            var vol = video.volume;
            vol = val;
            
            if (vol >= 0 && vol <= 1) {
                video.volume = vol;
            } else {
                video.volume = (vol < 0) ? 0 : 1;
            }
        },
        setVolumeChange = function (volumeCurrent, volumeInput, video, volumeIcon) {
            var vol,
                fn = function () {
                    vol = volumeInput.value / 100;
                    volumeCurrent.style.width = volumeInput.value + '%';
                    video.volume = vol;
                    volumeInput.setAttribute('value', vol * 100);
                    
                    if (vol > 0) {
                        volumeIcon.classList.remove('mute');
                        volumeIcon.classList.add('unmute');
                    } else {
                        volumeIcon.classList.remove('unmute');
                        volumeIcon.classList.add('mute');
                    }
                };
            
            volumeInput.addEventListener('change', fn, false);
        },
        togglePlay = function (eventSource, btnPlay, video) {
            var fn = function () {
                if (btnPlay.classList.contains('play')) {
                    btnPlay.classList.remove('play');
                    btnPlay.classList.add('pause');
                    video.play();
                } else if (btnPlay.classList.contains('replay')) {
                    btnPlay.classList.remove('replay');
                    btnPlay.classList.add('pause');
                    video.currentTime = 0;
                    video.play();
                } else {
                    btnPlay.classList.remove('pause');
                    btnPlay.classList.add('play');
                    video.pause();
                }
            };
            
            eventSource.addEventListener('click', fn, false);
        },
        toggleFullscreen = function (button, video) {
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
        toggleShowHideControls = function (controls, video) {
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
        toggleVolumeMute = function (button, volumeInput, volumeCurrent, video) {
            var vol,
                fn = function () {
                    vol = parseInt(volumeInput.getAttribute('value'), 10);
                    
                    if (button.classList.contains('mute')) {
                        button.classList.remove('mute');
                        button.classList.add('unmute');
                        video.volume = vol / 100;
                        volumeCurrent.style.width = vol + '%';
                        volumeInput.value = vol;
                    } else {
                        button.classList.remove('unmute');
                        button.classList.add('mute');
                        video.volume = 0;
                        volumeCurrent.style.width = 0;
                        volumeInput.value = 0;
                    }
                };
            
            button.addEventListener('click', fn, false);
        },
        displayControls = function () {
            var parent = objects.videoWrappers,
                parentLen = parent.length,
                i,
                video,
                controls,
                barTime,
                btnFullscreen,
                btnPlay,
                icoLogo,
                progressWrapper,
                progressCurrent,
                progressInput,
                volumeWrapper,
                volumeIcon,
                volumeCurrent,
                volumeInput;
            
            for (i = 0; i < parentLen; i++) {
                video = parent[i].getElementsByTagName('video')[0];
                controls = parent[i].getElementsByClassName('controls')[0];
                
                video.setAttribute('width', parent[i].offsetWidth);
                
                icoLogo = document.createElement('div');
                icoLogo.className = 'ico-logo';
                
                btnPlay = document.createElement('div');
                btnPlay.className = 'btn-play play';
                btnPlay.setAttribute('title', 'Putar');
                
                progressWrapper = document.createElement('div');
                progressWrapper.className = 'bar-progress-wrapper';
                progressCurrent = document.createElement('div');
                progressCurrent.className = 'bar-progress-current';
                progressInput = document.createElement('input');
                progressInput.className = 'bar-progress-range';
                progressInput.setAttribute('type', 'range');
                progressInput.setAttribute('value', 0);
                
                progressWrapper.appendChild(progressCurrent);
                progressWrapper.appendChild(progressInput);
                
                barTime = document.createElement('div');
                barTime.className = 'bar-time';
                barTime.textContent = '00:00:00';
                
                volumeWrapper = document.createElement('div');
                volumeWrapper.className = 'volume-wrapper';
                volumeIcon = document.createElement('div');
                volumeIcon.className = "ico-volume unmute";
                volumeCurrent = document.createElement('div');
                volumeCurrent.className = 'bar-volume-current';
                volumeInput = document.createElement('input');
                volumeInput.className = 'bar-volume-range';
                volumeInput.setAttribute('type', 'range');
                volumeInput.setAttribute('value', 50);
                
                volumeWrapper.appendChild(volumeIcon);
                volumeWrapper.appendChild(volumeCurrent);
                volumeWrapper.appendChild(volumeInput);
                
                btnFullscreen = document.createElement('div');
                btnFullscreen.className = 'btn-fullscreen';
                btnFullscreen.setAttribute('title', 'Layar penuh');
                
                controls.appendChild(icoLogo);
                controls.appendChild(btnPlay);
                controls.appendChild(progressWrapper);
                controls.appendChild(barTime);
                controls.appendChild(volumeWrapper);
                controls.appendChild(btnFullscreen);
                
                setVolume(0.5, video);
                togglePlay(btnPlay, btnPlay, video);
                togglePlay(video, btnPlay, video);
                setProgress(progressCurrent, progressInput, video, btnPlay, barTime, controls);
                setProgressChange(progressInput, video);
                setVolumeChange(volumeCurrent, volumeInput, video, volumeIcon);
                toggleVolumeMute(volumeIcon, volumeInput, volumeCurrent, video);
                toggleFullscreen(btnFullscreen, video);
                toggleShowHideControls(controls, video);
                setInitialDuration(barTime, video); //webkit returns NaN if video's duration value is fetched without listening to loadedmetadata event
            }
        },
        init = function () {
            displayControls();
        };
    
    return {init : init};
}());

//var videos = (function () {
//	'use strict';
//	var iconsPath = './assets/img/',
//        togglePlay = function (obj, button, video) {
//
//            var fn = function () {
//                if (video.paused) {
//                    video.play();
//                    button.setAttribute('src', iconsPath + 'ico_pause.svg');
//                } else {
//                    video.pause();
//                    button.setAttribute('src', iconsPath + 'ico_play.svg');
//                }
//            };
//
//            obj.addEventListener('click', fn, false);
//        },
//        toggleFullscreen = function (button, video) {
//
//            //var video = box.getElementsByTagName('video')[0];
//            var fn = function () {
//                if (!video.fullscreenElement && !video.mozFullScreenElement && !video.webkitFullscreenElement && !video.msFullscreenElement) {
//                    if (video.webkitRequestFullscreen) {
//                        video.webkitRequestFullscreen();
//                    } else if (video.mozRequestFullScreen) {
//                        video.mozRequestFullScreen();
//                    } else if (video.msRequestFullscreen) {
//                        video.msRequestFullscreen();
//                    } else if (video.requestFullscreen) {
//                        video.requestFullscreen();
//                    }
//                } else {
//                    if (video.webkitExitFullscreen) {
//                        video.webkitExitFullscreen();
//                    } else if (video.mozCancelFullScreen) {
//                        video.mozCancelFullScreen();
//                    } else if (video.msExitFullscreen) {
//                        video.msExitFullscreen();
//                    } else if (video.exitFullscreen) {
//                        video.exitFullscreen();
//                    }
//                }
//            };
//            button.addEventListener('click', fn, false);
//        },
//        toggleControls = function (video, controls) {
//
//            /*if (video.paused) {
//                if (controls.classList.contains('hidden')) {
//                    controls.classList.remove('hidden');
//                }
//            }*/
//
//            video.addEventListener('mouseover', function () {
//                if (!video.paused) {
//                    if (controls.classList.contains('hidden')) {
//                        controls.classList.remove('hidden');
//                    }
//                }
//
//            }, false);
//
//            video.addEventListener('mouseout', function () {
//                if (!video.paused) {
//                    if (!controls.classList.contains('hidden')) {
//                        controls.classList.add('hidden');
//                    }
//                }
//            }, false);
//
//            controls.addEventListener('mouseover', function () {
//                if (!video.paused) {
//                    if (controls.classList.contains('hidden')) {
//                        controls.classList.remove('hidden');
//                    }
//                }
//
//            }, false);
//
//            controls.addEventListener('mouseout', function () {
//                if (!video.paused) {
//                    if (!controls.classList.contains('hidden')) {
//                        controls.classList.add('hidden');
//                    }
//                }
//            }, false);
//        },
//        setProgress = function (obj, objCurrent, video, controls) {
//
//            var fn = function () {
//                var percentage = Math.floor((100 / video.duration) * video.currentTime),
//                    btnPlay = video.parentNode.getElementsByClassName('btn-play');
//                obj.value = percentage;
//                objCurrent.style.width = percentage + '%';
//                if (video.ended) {
//                    btnPlay[0].setAttribute('src', iconsPath + 'ico_play.svg');
//                    if (controls.classList.contains('hidden')) {
//                        controls.classList.remove('hidden');
//                    }
//                }
//            };
//
//            video.addEventListener('timeupdate', fn, false);
//        },
//        setProgressChange = function (obj, video) {
//
//            var fn = function () {
//                var time = video.duration * (obj.value / 100);
//                video.currentTime = time;
//            };
//
//            obj.addEventListener('change', fn, false);
//        },
//        setVolume = function (val, video) {
//
//            var vol = video.volume;
//            vol += val;
//
//            if (vol >= 0 && vol <= 1) {
//                video.volume = vol;
//            } else {
//                video.volume = (vol < 0) ? 0 : 1;
//            }
//        },
//        setProgressVolume = function (obj, objCurrent, video, speakerIcon) {
//
//            var fn = function () {
//                var vol = obj.value / 100;
//                objCurrent.style.width = obj.value + '%';
//                video.volume = vol;
//                speakerIcon.className = (vol === 0) ? 'muted' : 'normal';
//            };
//
//            obj.addEventListener('change', fn, false);
//        },
//        init = function () {
//
//            //declare variables first before jslint spank me
//            var videoWrapper = document.getElementsByClassName('box-video'),
//                vwLen = videoWrapper.length,
//                i,
//                video,
//                controls,
//                logo,
//                btnFullscreen,
//                btnPlay,
//                progress,
//                progressCurrent,
//                volumeWrapper,
//                volumeCurrent,
//                volumeImg,
//                volumeBar,
//                w,
//                h;
//
//            for (i = 0; i < vwLen; i++) {
//                video = videoWrapper[i].getElementsByTagName('video')[0];
//                controls = videoWrapper[i].getElementsByClassName('controls')[0];
//                w = videoWrapper[i].offsetWidth;
//                h = videoWrapper[i].offsetHeight;
//                console.log('w: ' + w + ' h: ' + h);
//                
//                video.setAttribute('width', w);
//                video.setAttribute('height', h);
//                
//                logo = document.createElement('img');
//                logo.setAttribute('src', iconsPath + 'logo_kompas.svg');
//                logo.setAttribute('alt', 'Kompas');
//                logo.className = 'logo';
//
//                btnPlay = document.createElement('img');
//                btnPlay.setAttribute('src', iconsPath + 'ico_play.svg');
//                btnPlay.setAttribute('alt', 'Mainkan');
//                btnPlay.setAttribute('title', 'Mainkan');
//                btnPlay.className = 'btn-play';
//                btnPlay.textContent = 'Main';
//
//                progress = document.createElement('input');
//                progress.setAttribute('value', 0);
//                progress.setAttribute('type', 'range');
//                progress.className = 'bar-progress';
//
//                progressCurrent = document.createElement('div');
//                progressCurrent.style.width = 0;
//                progressCurrent.className = 'bar-progress-current';
//
//                //HTML5 video's volume has a default value of 1, therefore reduce it to 0.5
//                setVolume(-0.5, video);
//
//                volumeWrapper = document.createElement('div');
//                volumeWrapper.className = 'wrapper-volume';
//                volumeCurrent = document.createElement('div');
//                volumeCurrent.className = 'volume-current';
//                volumeImg = document.createElement('img');
//                volumeImg.className = 'normal';
//                volumeImg.setAttribute('src', iconsPath + 'ico_mute.svg');
//                volumeImg.setAttribute('alt', 'volume');
//                volumeBar = document.createElement('input');
//                volumeBar.setAttribute('value', (video.volume * 100));
//                volumeBar.setAttribute('type', 'range');
//                volumeBar.setAttribute('min', 0);
//                volumeBar.setAttribute('max', 100);
//                volumeBar.className = 'bar-volume';
//
//                volumeWrapper.appendChild(volumeCurrent);
//                volumeWrapper.appendChild(volumeImg);
//                volumeWrapper.appendChild(volumeBar);
//
//                btnFullscreen = document.createElement('img');
//                btnFullscreen.setAttribute('src', iconsPath + 'ico_fullscreen.svg');
//                btnFullscreen.setAttribute('alt', 'Layar penuh');
//                btnFullscreen.setAttribute('title', 'Layar penuh');
//
//                btnFullscreen.className = 'btn-fullscreen';
//
//                controls.appendChild(logo);
//                controls.appendChild(btnPlay);
//                controls.appendChild(progressCurrent);
//                controls.appendChild(progress);
//                controls.appendChild(volumeWrapper);
//                controls.appendChild(btnFullscreen);
//
//
//                toggleControls(video, controls);
//                togglePlay(video, btnPlay, video);
//                togglePlay(btnPlay, btnPlay, video);
//                setProgress(progress, progressCurrent, video, controls);
//                setProgressChange(progress, video);
//                setProgressVolume(volumeBar, volumeCurrent, video, volumeImg);
//                toggleFullscreen(btnFullscreen, video);
//
//            }
//        };
//
//    return {init : init};
//}());

window.addEventListener('load', videos.init, false);