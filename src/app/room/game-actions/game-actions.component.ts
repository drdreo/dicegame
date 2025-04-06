import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GameService } from "../../shared/game.service";

@Component({
    selector: "app-game-actions",
    imports: [],
    templateUrl: "./game-actions.component.html",
    styleUrl: "./game-actions.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameActionsComponent {
    private readonly gameService = inject(GameService);

    rollDice() {
        this.gameService.rollDice();
    }

    setAside() {}
}
