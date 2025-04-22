import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideSkipForward } from "@ng-icons/lucide";
import { MusicService } from "../music.service";

@Component({
    selector: "app-music-playlist",
    imports: [CommonModule, NgIcon],
    providers: [provideIcons({ lucideSkipForward })],
    template: `
        <div class="music-controls">
            <label>
                <input type="checkbox" (change)="togglePlayback()" [checked]="isPlaying()" />
                Music
            </label>

            <ng-icon name="lucideSkipForward" (click)="nextTrack()" class="skip-btn" />
            <input
                type="range"
                min="0"
                max="0.1"
                step="0.001"
                (input)="changeVolume($event)"
                [value]="musicService.audio.volume"
                class="volume-slider"
            />
        </div>
    `,
    styleUrl: "./music-playlist.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicPlaylistComponent {
    readonly musicService = inject(MusicService);

    isPlaying = this.musicService.isPlaying;

    togglePlayback() {
        this.musicService.togglePlayback();
    }

    changeVolume(event: Event) {
        this.musicService.changeVolume(event);
    }

    nextTrack() {
        this.musicService.nextTrack();
    }
}
