import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, signal, viewChild } from "@angular/core";
import { DiceBox, DiceEventData } from "@drdreo/dice-box-threejs";
import { DiceBoardComponent } from "../room/dice-board/dice-board.component";

@Component({
    selector: "app-dice-test",
    imports: [DiceBoardComponent],
    template: `
        <p>dice-test works!</p>
        <p>Click: {{ lastClicked() }}</p>
        <button (click)="rollDice('3dpip')">Roll Dice</button>
        <div id="custom-dice-box"></div>
        <div class="game-container">
            <app-dice-board
                #diceBoard
                (onDiceClick)="onDiceClick($event)"
                [currentDice]="currentDice()"
                [selectedDice]="selectedDice()"
            />
        </div>
    `,
    styles: `
        #custom-dice-box {
            width: 500px;
            height: 500px;
            position: relative;
            overflow: hidden;
            border: 1px solid mediumvioletred;
        }

        .game-container {
            border: 1px solid mediumvioletred;
            height: 500px;
            width: 500px;
            margin: 1rem;
            overflow: hidden;
            background: url("/images/game_board_1.jpg") no-repeat center center fixed;
            background-size: cover;
            color: white;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiceTestComponent implements AfterViewInit {
    lastClicked = signal("");

    currentDice = signal([1, 2, 3, 4, 5]);
    selectedDice = computed(() => {
        const dice = this.currentDice();
        return [0];
    });

    diceBoard = viewChild(DiceBoardComponent);
    diceBox: DiceBox | undefined;

    constructor() {
        // Simulate a dice roll every 2 seconds
        // setInterval(() => {
        //     const randomDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
        //     this.currentDice.set(randomDice);
        // }, 5000);

        effect(() => {
            const diceBoard = this.diceBoard();
            console.log(diceBoard);
            const diceBox = diceBoard?.diceBox();
            console.log({ diceBox });
        });
    }

    ngAfterViewInit() {
        this.diceBox = new DiceBox("#custom-dice-box", {
            enableDiceSelection: true,
            onDiceHover: (diceInfo) => {
                console.log("Dice hovered:", diceInfo);
            },
            onDiceClick: (diceInfo) => {
                console.log("Dice clicked:", diceInfo);
            },
            onRollComplete: (results) => {
                console.log("Roll results:", results);
            }
        });

        console.log("DiceBox initialized:", this.diceBox);
        this.diceBox.initialize();
    }

    rollDice(notation: string) {
        console.log("Roll dice:", notation);
        const diceBox = this.diceBox;
        if (diceBox) {
            diceBox.roll(notation);
        } else {
            console.warn("DiceBox not initialized");
        }
    }

    onDiceClick($event: DiceEventData) {
        this.lastClicked.set(`Clicked: ${$event.id}`);
    }
}
