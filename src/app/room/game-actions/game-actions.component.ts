import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from "@angular/core";
import { GameService } from "../../shared/game.service";
import { HotkeyService } from "../../shared/hotkey.service";
import { isValidDice } from "../game.utils";

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

    hasSelectedDice = computed(() => this.gameService.selectedDice().length > 0);
    isYourTurn = this.gameService.isYourTurn;
    isRolling = this.gameService.isRolling;

    canRoll = computed(() => {
        const dice = this.gameService.currentDice();
        const initialDice = dice.every((d) => !isValidDice(d));
        return this.isYourTurn() && !this.isRolling() && initialDice;
    });

    constructor() {
        this.hotkey.addShortcut("space").subscribe(() => {
            this.rollDice();
        });

        this.hotkey.addShortcut("s").subscribe(() => {
            this.setAsideAndContinue();
        });

        this.hotkey.addShortcut("f").subscribe(() => {
            this.setAsideAndEnd();
        });
    }

    ngOnDestroy() {
        this.hotkey.removeShortcut("space");
        this.hotkey.removeShortcut("s");
        this.hotkey.removeShortcut("f");
    }

    rollDice() {
        if (!this.canRoll()) {
            return;
        }
        this.gameService.rollDice();
    }

    setAsideAndContinue() {
        if (this.gameService.isRolling() || !this.hasSelectedDice() || !this.gameService.isYourTurn()) {
            return;
        }
        this.gameService.setDiceAside(false);
    }

    setAsideAndEnd() {
        if (this.gameService.isRolling() || !this.hasSelectedDice() || !this.gameService.isYourTurn()) {
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
