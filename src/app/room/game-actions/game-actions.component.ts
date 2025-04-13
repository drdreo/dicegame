import { ChangeDetectionStrategy, Component, inject, OnDestroy } from "@angular/core";
import { GameService } from "../../shared/game.service";
import { HotkeyService } from "../../shared/hotkey.service";

@Component({
    selector: "app-game-actions",
    imports: [],
    templateUrl: "./game-actions.component.html",
    styleUrl: "./game-actions.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameActionsComponent implements OnDestroy {
    private readonly gameService = inject(GameService);
    private readonly hotkey = inject(HotkeyService);

    constructor() {
        this.hotkey.addShortcut("space").subscribe(() => {
            console.log("space pressed");
            this.rollDice();
        });

        this.hotkey.addShortcut("s").subscribe(() => {
            console.log("s pressed");
            this.setAsideAndContinue();
        });

        this.hotkey.addShortcut("f").subscribe(() => {
            console.log("f pressed");
            this.setAsideAndEnd();
        });
    }

    ngOnDestroy() {
        this.hotkey.removeShortcut("space");
        this.hotkey.removeShortcut("s");
        this.hotkey.removeShortcut("f");
    }

    rollDice() {
        if (this.gameService.isRolling()) {
            return;
        }
        this.gameService.rollDice();
    }

    setAsideAndContinue() {
        if (this.gameService.isRolling()) {
            return;
        }
        this.gameService.setDiceAside(false);
    }

    setAsideAndEnd() {
        if (this.gameService.isRolling()) {
            return;
        }
        this.gameService.setDiceAside(true);
    }

    endTurn() {
        if (this.gameService.isRolling()) {
            return;
        }
        this.gameService.endTurn();
    }
}
