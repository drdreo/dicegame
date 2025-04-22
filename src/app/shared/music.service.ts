import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class MusicService {
    isPlaying = signal(false);
    audio: HTMLAudioElement = new Audio();

    private playlist: string[] = [
        "sounds/background/medieval-background-196571.mp3",
        "sounds/background/medieval-citytavern-ambient-235876.mp3",
        "sounds/background/Minstrel_Dance.mp3",
        "sounds/background/022815townbgm.ogg",
        "sounds/background/old-tavern-cinematic-atmosphere-fairytale-273871.mp3",
        "sounds/background/pirate-tavern-full-version-167990.mp3",
        "sounds/background/The_Bards_Tale.mp3",
        "sounds/background/The_Old_Tower_Inn.mp3",
        "sounds/background/Woodland_Fantasy.mp3"
    ];
    private currentTrackIndex: number = Math.floor(Math.random() * this.playlist.length);
    private hasUserInteracted = false;

    constructor() {
        this.setupAudio();
        document.addEventListener(
            "click",
            () => {
                if (!this.hasUserInteracted) {
                    this.hasUserInteracted = true;
                    this.playMusic();
                }
            },
            { once: true }
        );
    }

    playMusic() {
        if (this.isPlaying()) {
            console.log("Music is already playing.");
            return;
        }

        this.audio
            .play()
            .then(() => {
                this.isPlaying.set(true);
            })
            .catch((error) => {
                console.log("Playback failed:", error);
                this.isPlaying.set(false);
            });
    }

    togglePlayback() {
        if (this.isPlaying()) {
            this.audio.pause();
            this.isPlaying.set(false);
        } else {
            this.playMusic();
        }
    }

    toggleMute(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        this.audio.muted = checkbox.checked;
    }

    changeVolume(event: Event) {
        const slider = event.target as HTMLInputElement;
        this.setVolume(parseFloat(slider.value));
    }

    setVolume(volume: number) {
        this.audio.volume = volume;
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        const song = this.playlist[this.currentTrackIndex];
        console.log(`Changing to next audio track: ${song}`);

        this.audio.src = song;
        this.audio.load();
        this.audio.play().catch((error) => console.log("Auto playback failed:", error));
        this.isPlaying.set(true);
    }

    private setupAudio() {
        console.debug("Setting up audio");
        this.audio.src = this.playlist[this.currentTrackIndex];
        this.setVolume(0.03);
        this.audio.load();
        this.audio.addEventListener("ended", () => this.nextTrack());
    }
}
