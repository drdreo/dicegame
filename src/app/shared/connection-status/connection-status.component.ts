import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCircleHelp, lucideRadioTower, lucideSignal, lucideUnplug } from "@ng-icons/lucide";
import { SocketService } from "../socket.service";

@Component({
    selector: "connection-status",
    // careful to keep NgIcons
    imports: [NgIcon],
    providers: [provideIcons({ lucideCircleHelp, lucideRadioTower, lucideSignal, lucideUnplug })],
    template: ` @switch (connectionStatus()) {
        @case ("Connected") {
            <ng-icon name="lucideSignal" color="white" title="Connected" />
        }
        @case ("Connecting") {
            <ng-icon name="lucideRadioTower" title="Connecting" />
        }
        @case ("Disconnecting") {
            <ng-icon name="lucideUnplug" title="Disconnecting" />
        }
        @case ("Disconnected") {
            <ng-icon name="lucideUnplug" color="red" title="Disconnected" />
        }
        @default {
            <ng-icon name="lucideCircleHelp" title="Unknown status" />
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

    connectionStatus = computed(() => {
        const status = this.socketService.connectionStatus();
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
    });
}
