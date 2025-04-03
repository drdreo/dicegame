import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { GameService } from "../../shared/game.service";

@Component({
    selector: "app-game-stats",
    imports: [],
    templateUrl: "./game-stats.component.html",
    styleUrl: "./game-stats.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStatsComponent {
    private readonly gameService = inject(GameService);

    you = this.gameService.player;
    enemy = this.gameService.enemy;

    goal = computed(() => {
        const state = this.gameService.gameState();
        return state?.targetScore ?? 0;
    });
}
