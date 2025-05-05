import { animate, query, style, transition, trigger } from "@angular/animations";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideLogOut } from "@ng-icons/lucide";
import { GameService } from "../game.service";

@Component({
    selector: "app-winner-notification",
    imports: [NgIcon],
    providers: [provideIcons({ lucideLogOut })],
    template: `
        <div class="overlay">
            <div class="banner-container" [@bannerSequence]>
                <div class="banner-wrapper">
                    <div class="banner-background"></div>
                    <div class="banner-content">{{ winner() }} won</div>
                </div>
                <button class="leave-button error" (click)="leave()">
                    Leave
                    <ng-icon name="lucideLogOut" />
                </button>
            </div>
        </div>
    `,
    styles: [
        `
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .banner-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow: visible;
            }

            .banner-wrapper {
                position: relative;
                min-width: 300px;
                min-height: 150px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .banner-background {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: url("/images/winner_background.png");
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                transform-origin: center;
                transform: scaleX(1.5);
            }

            .banner-content {
                position: relative;
                color: white;
                font-size: 3rem;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                padding: 30px 50px;
                text-align: center;
            }

            .leave-button {
                display: inline-flex;
                gap: 10px;
                justify-content: center;
                align-items: center;
            }
        `
    ],
    animations: [
        trigger("bannerSequence", [
            transition(":enter", [
                // Initial states
                query(".banner-background", [style({ transform: "scaleX(0)", opacity: 0 })]),
                query(".banner-content, .leave-button", [style({ opacity: 0 })]),

                // Step 1: Animate banner background
                query(".banner-background", [
                    animate(
                        "800ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        style({ transform: "scaleX(1.5)", opacity: 1 })
                    )
                ]),

                // Step 2: Animate content
                query(".banner-content", [animate("400ms ease-out", style({ opacity: 1 }))]),

                // Step 3: Animate button
                query(".leave-button", [animate("400ms 1s ease-in", style({ opacity: 1 }))])
            ])
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WinnerNotificationComponent {
    private readonly gameService = inject(GameService);
    winner = input.required<string>();

    leave() {
        this.gameService.leaveRoom();
    }
}
