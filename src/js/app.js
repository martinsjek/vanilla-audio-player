import Polyfills from "./modules/polyfills";

export default class AudioPlayer{
    constructor(selector, tracks) {
        let polyFills = new Polyfills();
        this.selectedTrack = 0;
        this.audio = null;
        this.audioPlayer = document.querySelector(selector);
        this.tracks = tracks;
        this.paused = true;
        this.initPlayerDom();
        this.initPlayer(tracks);
        this.initActions();
    }

    initActions(){
        //toggle between playing and pausing on button click
        const playBtn = this.audioPlayer.querySelector(".controls .play-toggle");
        playBtn.addEventListener("click", () => {
            this.checkPlayStatus();
        });

        //on prev button
        const prevBtn = this.audioPlayer.querySelector(".controls .prev");
        prevBtn.addEventListener("click", () => {
            this.playPrevious();
        });

        //on next button
        const nextBtn = this.audioPlayer.querySelector(".controls .next");
        nextBtn.addEventListener("click", () => {
            this.playNext();
        });

        //on volume (mute) click
        const volumeButton = this.audioPlayer.querySelector(".volume-button");
        volumeButton.addEventListener("click", () => {
            volumeButton.classList.toggle('mute');
            this.audio.muted = !this.audio.muted;
        });

        //click on timeline to skip around
        const timeline = this.audioPlayer.querySelector(".timeline");
        timeline.addEventListener("click", e => {
            const timelineWidth = window.getComputedStyle(timeline).width;
            this.audio.currentTime = e.offsetX / parseInt(timelineWidth) * this.audio.duration;
        });

        //click volume slider to change volume
        const volumeSlider = this.audioPlayer.querySelector(".controls .volume-slider");
        volumeSlider.addEventListener('click', e => {
            const sliderWidth = window.getComputedStyle(volumeSlider).width;
            const newVolume = e.offsetX / parseInt(sliderWidth);
            this.audio.volume = newVolume;
            this.audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
        });

        //check audio percentage and update time accordingly
        setInterval(() => {
            const progressBar = this.audioPlayer.querySelector(".progress");
            progressBar.style.width = this.audio.currentTime / this.audio.duration * 100 + "%";
            this.audioPlayer.querySelector(".time .current").textContent = this.getTimeCodeFromNum(this.audio.currentTime);
            if(this.audio.currentTime >= this.audio.duration){
                this.playNext();
            }
        }, 500);
    }

    initPlayerDom(){
        const HtmlStringTimeline = '<div class="progress"></div>';
        const htmlStringControls = '<div class="track-controls"> <div class="prev"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path d="M277.965 511.997c-8.831 0-17.487-3.455-24.007-9.976-.13-.13-.258-.262-.385-.395L41.352 279.419l-.147-.155c-12.239-13.045-12.239-33.482 0-46.527l.147-.155L253.573 10.373c.127-.133.255-.265.385-.395 9.758-9.759 24.301-12.652 37.053-7.37A33.902 33.902 0 01312 34.021V477.98a33.9 33.9 0 01-20.989 31.412 34.047 34.047 0 01-13.046 2.605zM436 512h-48c-24.262 0-44-19.738-44-44V44c0-24.262 19.738-44 44-44h48c24.262 0 44 19.738 44 44v424c0 24.262-19.738 44-44 44z"/> </svg> </div><div class="play play-toggle"></div><div class="next"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path d="M234.035 511.997c-4.387 0-8.814-.853-13.046-2.605A33.9 33.9 0 01200 477.979V34.021a33.898 33.898 0 0120.989-31.412c12.749-5.28 27.294-2.389 37.053 7.37.13.13.259.262.386.395l212.221 222.208.146.154c12.241 13.046 12.241 33.483 0 46.529-.049.052-.097.104-.146.154L258.428 501.627c-.127.133-.256.265-.386.395-6.52 6.519-15.178 9.975-24.007 9.975zm219.257-249.154h.01zM124 512H76c-24.262 0-44-19.738-44-44V44C32 19.738 51.738 0 76 0h48c24.262 0 44 19.738 44 44v424c0 24.262-19.738 44-44 44zm0-464h.01z"/> </svg> </div></div><div class="time"> <div class="current">0:00</div><div class="divider">/</div><div class="length"></div></div><div class="name"><p></p></div><div class="volume-container"> <div class="volume-button"> <div class="volume"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448.116 448.116"> <path d="M267.786 16.406c-7.037 0-13.813 2.04-20.161 6.049l-136.888 98.054h-46.24C28.936 120.509 0 149.444 0 185.006v87.827c.006 35.57 28.936 64.504 64.504 64.504h46.328l136.578 89.689 1.025.622c4.893 2.696 10.243 4.062 15.886 4.062h.008c13.661 0 28.052-8.251 39.489-22.634 10.628-13.336 16.699-29.374 16.699-43.974V84.53c.007-27.775-20.538-68.124-52.731-68.124zm21.344 348.706c0 7.413-3.787 16.774-9.874 24.433-6.288 7.895-12.367 10.78-14.92 10.78l-.581-.14-143.534-94.251H64.498c-18.25 0-33.097-14.84-33.097-33.102v-87.827h.008c0-18.25 14.846-33.095 33.096-33.095h56.33L264.737 48.812c1.698-1.004 2.713-1.004 3.073-1.004 8.224 0 21.327 20.047 21.327 36.722v280.582h-.007zm-27.951-259.927c7.573 10.575 5.165 25.287-5.406 32.861l-116.067 83.208H73.26c-13.01 0-23.551-10.542-23.551-23.552S60.25 174.15 73.26 174.15h51.312l103.75-74.384c10.563-7.588 25.282-5.155 32.857 5.419zm186.937 103.176v31.398h-90.279v-31.398h90.279zm-65.977 113.98l63.846 63.838-22.201 22.21-63.846-63.847 22.201-22.201zm.015-196.572l-22.201-22.211 63.83-63.831 22.201 22.203-63.83 63.839z"/> </svg> </div></div><div class="volume-slider"> <div class="volume-percentage"></div></div></div>';

        const audioPlayerTimeline = document.createElement('div');
        audioPlayerTimeline.classList.add('timeline');
        audioPlayerTimeline.innerHTML = HtmlStringTimeline;
        this.audioPlayer.appendChild(audioPlayerTimeline);

        const audioPlayerControls = document.createElement('div');
        audioPlayerControls.classList.add('controls');
        audioPlayerControls.innerHTML = htmlStringControls;
        this.audioPlayer.appendChild(audioPlayerControls);
    }

    initPlayer(tracks){
        if(this.audio){
            this.audio.pause();
        }

        this.audio = new Audio(tracks[this.selectedTrack].src);

        if(this.audio && !this.paused){
            this.audio.play();
        }

        this.audio.addEventListener("loadeddata", () => {
            const name = this.audioPlayer.querySelector(".name p");
            this.audioPlayer.querySelector(".time .length").textContent = this.getTimeCodeFromNum(this.audio.duration);
            name.innerHTML = this.tracks[this.selectedTrack].name;
            name.setAttribute('title',this.tracks[this.selectedTrack].name);
            this.audio.volume = .75;
        });
    }

    getTimeCodeFromNum(num) {
        let seconds = parseInt(num);
        let minutes = parseInt(seconds / 60);
        seconds -= minutes * 60;
        const hours = parseInt(minutes / 60);
        minutes -= hours * 60;

        if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
        return `${String(hours).padStart(2, 0)}:${minutes}:${String(
            seconds % 60
        ).padStart(2, 0)}`;
    }

    checkPlayStatus(){
        const playBtn = this.audioPlayer.querySelector(".controls .play-toggle");
        if (this.audio.paused) {
            playBtn.classList.remove("play");
            playBtn.classList.add("pause");
            this.paused = false;
            this.audio.play();
        } else {
            playBtn.classList.remove("pause");
            playBtn.classList.add("play");
            this.paused = true;
            this.audio.pause();
        }
    }

    playNext(){
        let trackLength = Object.keys(this.tracks).length - 1;
        if(trackLength > this.selectedTrack){
            this.selectedTrack++;
        }else{
            this.selectedTrack = 0;
        }
        this.initPlayer(this.tracks);
    }

    playPrevious(){
        let trackLength = Object.keys(this.tracks).length - 1;
        if(this.selectedTrack > 0){
            this.selectedTrack--;
        }else{
            this.selectedTrack = trackLength;
        }
        this.initPlayer(this.tracks);
    }
}