import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GameService } from "../shared/game.service";
import { DiceBoardComponent } from "./dice-board/dice-board.component";
import { GameStatsComponent } from "./game-stats/game-stats.component";

@Component({
    selector: "app-room",
    imports: [DiceBoardComponent, GameStatsComponent, DiceBoardComponent],
    templateUrl: "./room.component.html",
    styleUrl: "./room.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomComponent {
    private readonly gameService = inject(GameService);
}
