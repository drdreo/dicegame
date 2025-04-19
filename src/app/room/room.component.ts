import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GameService } from "../shared/game.service";
import { MusicPlaylistComponent } from "../shared/music-playlist/music-playlist.component";
import { DiceAsideComponent } from "./dice-aside/dice-aside.component";
import { DiceBoardComponent } from "./dice-board/dice-board.component";
import { GameActionsComponent } from "./game-actions/game-actions.component";
import { GameStatsComponent } from "./game-stats/game-stats.component";
import { WaitingRoomComponent } from "./waiting-room/waiting-room.component";

@Component({
    selector: "app-room",
    imports: [
        DiceBoardComponent,
        GameStatsComponent,
        DiceBoardComponent,
        MusicPlaylistComponent,
        GameActionsComponent,
        WaitingRoomComponent,
        DiceAsideComponent
    ],
    templateUrl: "./room.component.html",
    styleUrl: "./room.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {
    private readonly gameService = inject(GameService);

    started = this.gameService.started;
}
