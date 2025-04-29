import { ChangeDetectionStrategy, Component, effect, ElementRef, inject } from "@angular/core";
import { GameService } from "../shared/game.service";
import { InstructionsHelpComponent } from "../shared/instructions/instructions-help/instructions-help.component";
import { MusicPlaylistComponent } from "../shared/music-playlist/music-playlist.component";
import { DialogService } from "../shared/notifications/dialog.service";
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
        DiceAsideComponent,
        InstructionsHelpComponent
    ],
    templateUrl: "./room.component.html",
    styleUrl: "./room.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {
    private readonly ref = inject(ElementRef);
    private readonly gameService = inject(GameService);
    private readonly dialogService = inject(DialogService);

    started = this.gameService.started;

    constructor() {
        effect(() => {
            const winner = this.gameService.winner();
            if (!winner) return;
            console.log("Winner:", winner);
            this.dialogService.showWinner(winner, this.ref.nativeElement);
        });
    }
}
