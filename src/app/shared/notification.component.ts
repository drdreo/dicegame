import { Component, input, Input, output } from "@angular/core";

@Component({
    selector: "game-notification",
    template: `
        <div class="medieval-popup">
            <button class="close-button" (click)="close()">&times;</button>
            <h1>Notification</h1>
            <p>{{ message() }}</p>
        </div>
    `,
    styles: [
        `
            .medieval-popup {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff;
                border: 1px solid #ccc;
                padding: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                z-index: 1000;
            }

            .close-button {
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
            }
        `
    ]
})
export class NotificationComponent {
    message = input.required();

    onClose = output();

    close() {
        this.onClose.emit();
    }
}
