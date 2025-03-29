import DiceBox from "@3d-dice/dice-box-threejs";
import { AfterViewInit, Component, ElementRef, viewChild } from "@angular/core";

@Component({
    selector: "app-dice-board",
    imports: [],
    templateUrl: "./dice-board.component.html",
    styleUrl: "./dice-board.component.scss",
})
export class DiceBoardComponent implements AfterViewInit {
    private box!: DiceBox;

    diceContainer = viewChild<ElementRef>("diceContainer");
    values = [1, 2, 3, 4, 5, 6];
    private colors = ["#00ffcb", "#ff6600", "#1d66af", "#7028ed", "#c4c427", "#d81128"];

    ngAfterViewInit() {
        this.initializeDiceBox();
    }

    roll() {
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

        // this.box.updateConfig({
        //     theme_customColorset: {
        //         background: randomColor,
        //         foreground: "#ffffff",
        //         texture: "marble",
        //         material: "wood",
        //     },
        // });

        this.box.roll(`6d6@1,2,2,3,4,1`);
    }

    private async initializeDiceBox() {
        this.box = new DiceBox("#diceContainer", {
            theme_customColorset: {
                background: "#d0b990",
                foreground: "#ffffff",
                texture: "wood",
                material: "wood",
            },
            light_intensity: 1,
            gravity_multiplier: 300,
            baseScale: 75, // dice size
            strength: 0.5, // throw strength
            onRollComplete: (results: any) => {
                console.log(`onRollComplete: `, results);
            },
        });

        try {
            await this.box.initialize();
            // Initial roll after initialization
            setTimeout(() => {
                this.roll();
            }, 1000);
        } catch (e) {
            console.error(e);
        }
    }
}
