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
                left: 50%;
                transform: translateX(-50%);
                background-size: cover;
                border: 2px solid #8b4513;
                box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
                z-index: 1000;
                font-family: "MedievalSharp", sans-serif;
                color: #54390b;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem;
            }

            h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
                text-align: center;
                color: #8b4513; /* Darker brown for heading */
                text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
            }

            p {
                font-size: 1.2em;
                line-height: 1.4;
                margin: 0;
                color: white;
            }
        `
    ]
})
export class BustedNotificationComponent {
    player = input.required();
}
