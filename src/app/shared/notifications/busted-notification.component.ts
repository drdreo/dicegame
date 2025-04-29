import { Component, input } from "@angular/core";

@Component({
    selector: "busted-notification",
    template: `
        <div class="medieval-popup">
            <h1>BUSTED</h1>
            <p>{{ player() }}</p>
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
        `
    ]
})
export class BustedNotificationComponent {
    player = input.required();
}
