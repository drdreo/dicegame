import DiceBox from "@3d-dice/dice-box-threejs";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

@Component({
    selector: "app-dice-board",
    imports: [],
    templateUrl: "./dice-board.component.html",
    styleUrl: "./dice-board.component.scss",
})
export class DiceBoardComponent implements AfterViewInit {
    private box!: DiceBox;

    colors = ["#00ffcb", "#ff6600", "#1d66af", "#7028ed", "#c4c427", "#d81128"];

    values = [1, 2, 3, 4, 5, 6];

    @ViewChild("diceContainer") diceContainer!: ElementRef;

    ngAfterViewInit() {
        this.initializeDiceBox();
    }

    private async initializeDiceBox() {
        this.box = new DiceBox("#diceContainer", {
            theme_customColorset: {
                background: "#00ffcb",
                foreground: "#ffffff",
                texture: "wood",
                material: "wood",
            },
            light_intensity: 1,
            gravity_multiplier: 600,
            baseScale: 100,
            strength: 2,
            onRollComplete: (results: any) => {
                console.log(`I've got results :>> `, results);
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

    roll() {
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

        this.box.updateConfig({
            theme_customColorset: {
                background: randomColor,
                foreground: "#ffffff",
                texture: "glitter",
                material: "glass",
            },
        });

        this.box.roll(`6d6@1,2,2,3,4,1`);
    }
}
