import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { map } from "rxjs";
import { GameService } from "../../shared/game.service";

@Component({
    selector: "app-game-stats",
    imports: [AsyncPipe],
    templateUrl: "./game-stats.component.html",
    styleUrl: "./game-stats.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameStatsComponent {
    private readonly gameService = inject(GameService);
    currentScore$ = this.gameService.gameState$.pipe(map((gameState) => gameState.turnScore));
}
