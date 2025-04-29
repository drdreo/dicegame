import { animate, state, style, transition, trigger } from "@angular/animations";
import { ChangeDetectionStrategy, Component, computed, output, signal } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
    lucideDice1,
    lucideDice2,
    lucideDice3,
    lucideDice4,
    lucideDice5,
    lucideDice6,
    lucideChevronLeft,
    lucideChevronRight,
    lucideX
} from "@ng-icons/lucide";

type Combination = {
    dice: number[];
    score: number;
};

@Component({
    selector: "game-instructions",
    imports: [NgIcon],
    providers: [
        provideIcons({
            lucideDice1,
            lucideDice2,
            lucideDice3,
            lucideDice4,
            lucideDice5,
            lucideDice6,
            lucideChevronLeft,
            lucideChevronRight,
            lucideX
        })
    ],
    templateUrl: "./instructions.component.html",
    styleUrl: "./instructions.component.scss",
    animations: [
        trigger("flyInOut", [
            state("in", style({ transform: "translateX(0)" })),
            transition(":enter", [style({ transform: "translateX(-150%)" }), animate(250)]),
            transition(":leave", [animate(250, style({ transform: "translateX(-150%)" }))])
        ])
    ],
    host: {
        "[@flyInOut]": '"in"'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructionsComponent {
    onClose = output<void>();
    currentPage = signal(1);
    totalPages = 2;

    canGoPrevious = computed(() => this.currentPage() > 1);
    canGoNext = computed(() => this.currentPage() < this.totalPages);
    pageTitle = computed(() => (this.currentPage() === 1 ? "How to Play" : "Scoring Dice"));

    simpleDiceCombinations: Combination[] = [
        { dice: [1], score: 100 },
        { dice: [5], score: 50 },
        { dice: [1, 2, 3, 4, 5], score: 500 },
        { dice: [2, 3, 4, 5, 6], score: 750 },
        { dice: [1, 2, 3, 4, 5, 6], score: 1500 }
    ];

    multipleDiceCombinations: Combination[] = [
        { dice: [1, 1, 1], score: 1000 },
        { dice: [2, 2, 2], score: 200 },
        { dice: [3, 3, 3], score: 300 },
        { dice: [4, 4, 4], score: 400 },
        { dice: [5, 5, 5], score: 500 },
        { dice: [6, 6, 6], score: 600 }
    ];

    extraMultipleDiceCombinations: Combination[] = [
        { dice: [3, 3, 3, 3], score: 600 },
        { dice: [3, 3, 3, 3, 3], score: 1200 },
        { dice: [3, 3, 3, 3, 3, 3], score: 2400 }
    ];

    close() {
        this.onClose.emit();
    }

    nextPage() {
        const currentPage = this.currentPage();
        if (currentPage < this.totalPages) {
            this.currentPage.set(currentPage + 1);
        }
    }

    previousPage() {
        const currentPage = this.currentPage();
        if (currentPage > 1) {
            this.currentPage.set(currentPage - 1);
        }
    }
}
