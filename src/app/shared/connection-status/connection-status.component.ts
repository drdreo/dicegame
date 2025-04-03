import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideIcons, NgIcon } from "@ng-icons/core";
import { lucideSignal, lucideUnplug, lucideRadioTower, lucideCircleHelp } from "@ng-icons/lucide";
import { map } from "rxjs";
import { SocketService } from "../socket.service";

@Component({
    selector: "connection-status",
    // careful to keep NgIcons
    imports: [AsyncPipe, NgIcon],
    providers: [provideIcons({ lucideCircleHelp, lucideRadioTower, lucideSignal, lucideUnplug })],
    template: ` @switch (connectionStatus$ | async) {
        @case ("Connected") {
            <ng-icon name="lucideSignal" />
        }
        @case ("Connecting") {
            <ng-icon name="lucideRadioTower" />
        }
        @case ("Disconnecting") {
            <ng-icon name="lucideUnplug" />
        }
        @case ("Disconnected") {
            <ng-icon name="lucideUnplug" />
        }
        @default {
            <ng-icon name="lucideCircleHelp" />
        }
    }`,
    styles: `
        :host {
            position: absolute;
            top: 5px;
            right: 5px;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionStatusComponent {
    private readonly socketService = inject(SocketService);

    connectionStatus$ = this.socketService.connectionStatus$.pipe(
        map((status) => {
            switch (status) {
                case WebSocket.OPEN:
                    return "Connected";
                case WebSocket.CONNECTING:
                    return "Connecting";
                case WebSocket.CLOSING:
                    return "Disconnecting";
                case WebSocket.CLOSED:
                    return "Disconnected";
                default:
                    return "Unknown status";
            }
        })
    );
}
