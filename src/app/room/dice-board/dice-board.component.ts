import { toSignal } from "@angular/core/rxjs-interop";
import { DiceBox, DiceEventData, DiceResults } from "@drdreo/dice-box-threejs";
import { AfterViewInit, Component, effect, ElementRef, inject, signal, viewChild } from "@angular/core";
import { GameService } from "../../shared/game.service";

@Component({
    selector: "app-dice-board",
    imports: [],
    templateUrl: "./dice-board.component.html",
    styleUrl: "./dice-board.component.scss",
})
export class DiceBoardComponent implements AfterViewInit {
    private readonly gameService = inject(GameService);
    private currentDice = toSignal(this.gameService.currentDice$);
    private box?: DiceBox;

    private readonly diceContainer = viewChild<ElementRef>("diceContainer");
    private readonly hoverOverlay = viewChild<ElementRef>("hoverOverlay");
    private colors = ["#00ffcb", "#ff6600", "#1d66af", "#7028ed", "#c4c427", "#d81128"];

    constructor() {
        effect(() => {
            const dice = this.currentDice();
            if (dice && dice.length > 0) {
                console.log("Current dice: ", dice);
                this.visualizeDiceRoll(dice);
            }
        });
    }
    ngAfterViewInit() {
        this.initializeDiceBox();
    }

    rollDice() {
        this.gameService.rollDice();
    }

    visualizeDiceRoll(dice: number[]) {
        const notation = createNotationFromValues(dice);

        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

        // this.box.updateConfig({
        //     theme_customColorset: {
        //         background: randomColor,
        //         foreground: "#ffffff",
        //         texture: "marble",
        //         material: "wood",
        //     },
        // });

        this.box?.roll(notation);
    }

    private async initializeDiceBox() {
        const viewContainer = this.diceContainer()?.nativeElement;
        if (!viewContainer) {
            throw new Error("Cant init dice box without container");
        }

        this.box = new DiceBox(viewContainer, {
            theme_customColorset: {
                background: "#d0b990",
                foreground: "#ffffff",
                texture: "wood",
                material: "felt",
            },
            light_intensity: 1,
            sounds: true,
            gravity_multiplier: 300,
            baseScale: 75, // dice size
            strength: 0.5, // throw strength
            enableDiceSelection: true,
            onRollComplete: (results: DiceResults) => {
                console.log(`onRollComplete: `, results);
            },
            onDiceClick: (diceInfo: DiceEventData) => {
                console.log(`onDiceClick: `, diceInfo);
                this.gameService.selectDice(diceInfo.id);
            },
            onDiceHover: (diceInfo: DiceEventData | null) => {
                console.log(`onDiceHover: `, diceInfo);

                const overlay = this.hoverOverlay()!.nativeElement;

                if (diceInfo) {
                    // Position the overlay using the screen coordinates
                    overlay.style.left = `${diceInfo.screenPosition.x}px`;
                    overlay.style.top = `${diceInfo.screenPosition.y}px`;

                    // Scale the overlay based on the dice size
                    const size = diceInfo.scale * 75; // Adjust multiplier as needed
                    overlay.style.width = `${size}px`;
                    overlay.style.height = `${size}px`;

                    this.showOverlay(true);
                } else {
                    this.showOverlay(false);
                }
            },
        });

        try {
            await this.box.initialize();
            // Initial roll after initialization
            setTimeout(() => {
                this.visualizeDiceRoll([1, 2, 3]);
            }, 1000);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Controls the visibility of the hover overlay
     */
    private showOverlay(visible: boolean): void {
        const overlay = this.hoverOverlay()!.nativeElement;
        if (visible) {
            overlay.classList.add("visible");
        } else {
            overlay.classList.remove("visible");
        }
    }
}

// returns something like `6d6@1,2,2,3,4,1`
function createNotationFromValues(values: number[]): string {
    let count = values.length;
    return `${count}d6@${values.join(",")}`;
}
