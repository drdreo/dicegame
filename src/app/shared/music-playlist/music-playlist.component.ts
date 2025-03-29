import { ChangeDetectionStrategy, Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-music-playlist",
    imports: [CommonModule],
    templateUrl: "./music-playlist.component.html",
    styleUrl: "./music-playlist.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicPlaylistComponent implements OnInit {
    isPlaying = signal(false);
    private audio: HTMLAudioElement = new Audio();
    private playlist: string[] = ["sounds/background/medieval-background-196571.mp3"];
    private currentTrackIndex: number = 0;
    private hasUserInteracted = false;

    ngOnInit() {
        this.setupAudio();

        // Listen for any user interaction with the document
        document.addEventListener(
            "click",
            () => {
                if (!this.hasUserInteracted) {
                    this.hasUserInteracted = true;
                    this.playMusic();
                }
            },
            { once: true },
        );
    }

    playMusic() {
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
            console.log("Playback playback failed:", this.isPlaying());
            ``;
            this.playMusic();
        }
        this.hasUserInteracted = true;
    }

    setVolume(volume: number) {
        this.audio.volume = volume;
    }

    private setupAudio() {
        console.log("Setting up audio");
        this.audio.src = this.playlist[this.currentTrackIndex];
        this.setVolume(0.03);
        this.audio.load();
        this.audio.addEventListener("ended", this.nextTrack.bind(this));
    }

    private nextTrack() {
        console.log("Changing to next audio track");

        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.audio.src = this.playlist[this.currentTrackIndex];
        this.audio.load();
        this.audio.play().catch((error) => console.log("Auto playback failed:", error));
        this.isPlaying.set(true);
    }
}
