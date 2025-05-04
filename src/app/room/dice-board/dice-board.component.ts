import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    output,
    signal,
    viewChild
} from "@angular/core";
import { DiceBox, DiceEventData, DiceResults } from "@drdreo/dice-box-threejs";
import { DeviceService } from "../../shared/device.service";
import { isValidDice } from "../game.utils";

const DICE_SCALE = 75;

type SelectedOverlay = {
    x: number;
    y: number;
    size: number;
};

@Component({
    selector: "app-dice-board",
    imports: [],
    templateUrl: "./dice-board.component.html",
    styleUrl: "./dice-board.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiceBoardComponent implements AfterViewInit {
    private readonly deviceService = inject(DeviceService);
    private readonly diceContainer = viewChild<ElementRef>("diceContainer");
    private readonly hoverOverlay = viewChild<ElementRef>("hoverOverlay");
    private diceBox = signal<DiceBox | undefined>(undefined);

    currentDice = input<number[]>([]);
    selectedDice = input<number[]>([]);
    selectedDiceOverlay = computed(() => {
        const _redraw = this.reDrawOverlay();
        const dice = this.selectedDice();
        const overlayDice: SelectedOverlay[] = [];
        const box = this.diceBox();
        if (!box) {
            return overlayDice;
        }
        for (const dieId of dice) {
            const diceInfo = box.getDiceResults(dieId);
            if (diceInfo) {
                overlayDice.push({ ...diceInfo.screenPosition, size: diceInfo.scale * DICE_SCALE });
            }
        }

        return overlayDice;
    });
    isRolling = output<boolean>();
    onDiceClick = output<DiceEventData>();

    private reDrawOverlay = signal(false);
    private diceBoxConfig = {
        theme_customColorset: {
            background: "#d0b990",
            foreground: "#ffffff",
            texture: "wood",
            material: "wood"
        },
        light_intensity: 1,
        sounds: true,
        gravity_multiplier: 300,
        baseScale: 75, // dice size
        strength: 0.5, // throw strength
        enableDiceSelection: true
    };
    private colors = ["#00ffcb", "#ff6600", "#1d66af", "#7028ed", "#c4c427", "#d81128"];

    constructor() {
        effect(() => {
            const dice = this.currentDice();
            const box = this.diceBox();
            if (!box) {
                return;
            }
            if (dice && dice.length > 0 && dice.every(isValidDice)) {
                console.debug("Current dice: ", dice);
                this.visualizeDiceRoll(dice);
            } else {
                box.clearDice();
            }
        });
    }

    async ngAfterViewInit() {
        await this.initializeDiceBox();
        // check if we are joining an in progress game and visualize the dice and selected ones again
        const dice = this.currentDice();
        if (dice && dice.length > 0 && dice.every(isValidDice)) {
            this.visualizeDiceRoll(dice);
        }
    }

    async visualizeDiceRoll(dice: number[]) {
        const box = this.diceBox();
        if (!box) {
            console.error("Dice box not initialized");
            return;
        }
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

        this.isRolling.emit(true);
        box.roll(notation).catch((e) => {
            this.isRolling.emit(false);
            console.error(e);
        });
    }

    private async initializeDiceBox() {
        const viewContainer = this.diceContainer()?.nativeElement;
        if (!viewContainer) {
            throw new Error("Cant init dice box without container");
        }

        const box = new DiceBox(viewContainer, {
            ...this.diceBoxConfig,
            onRollComplete: (results: DiceResults) => {
                this.isRolling.emit(false);

                // if we already had selected (reconnected to game) re-draw overlay
                if (this.selectedDice().length > 0) {
                    this.reDrawOverlay.set(true);
                }
            },
            onDiceClick: (diceInfo: DiceEventData) => {
                this.onDiceClick.emit(diceInfo);
            },
            onDiceHover: (diceInfo: DiceEventData | null) => {
                if (this.deviceService.isTouchDevice) {
                    return;
                }

                const overlay = this.hoverOverlay()!.nativeElement;

                if (diceInfo) {
                    // Position the overlay using the screen coordinates
                    overlay.style.left = `${diceInfo.screenPosition.x}px`;
                    overlay.style.top = `${diceInfo.screenPosition.y}px`;

                    // Scale the overlay based on the dice size
                    const size = diceInfo.scale * DICE_SCALE; // Adjust multiplier as needed
                    overlay.style.width = `${size}px`;
                    overlay.style.height = `${size}px`;

                    this.showOverlay(true);
                } else {
                    this.showOverlay(false);
                }
            }
        });

        try {
            await box.initialize();
            this.diceBox.set(box);
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
        this.setCursor(visible);
    }

    private setCursor(hover: boolean): void {
        if (hover) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }
    }
}

// returns something like `6d6@1,2,2,3,4,1`
function createNotationFromValues(values: number[]): string {
    let count = values.length;
    return `${count}d6@${values.join(",")}`;
}
