import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { map } from "rxjs";
import { GameService } from "../shared/game.service";
import { SocketService } from "../shared/socket.service";

@Component({
    selector: "app-home",
    imports: [FormsModule, ReactiveFormsModule, AsyncPipe],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
    recentRooms = signal<string[]>([]);
    private readonly socketService = inject(SocketService);
    private readonly gameService = inject(GameService);
    connectionStatus$ = this.socketService.connectionStatus$.pipe(
        map((status) => {
            switch (status) {
                case WebSocket.OPEN:
                    return "Connected";
                case WebSocket.CLOSED:
                    return "Disconnected";
                case WebSocket.CONNECTING:
                    return "Connecting...";
                case WebSocket.CLOSING:
                    return "Disconnecting...";
                default:
                    return "Unknown status";
            }
        }),
    );
    private readonly fb = inject(FormBuilder);
    lobbyForm = this.fb.group({
        playerName: ["", [Validators.required, Validators.minLength(2)]],
        roomId: [""],
    });
    private readonly router = inject(Router);

    ngOnInit() {
        this.loadRecentRooms();
    }

    onSubmit() {
        if (this.lobbyForm.valid) {
            const { playerName, roomId } = this.lobbyForm.value;
            this.gameService.joinRoom(playerName!, roomId ?? undefined);
            // this.router.navigate(["/game", roomId]);
        }
    }

    quickJoin(roomId: string) {
        // Pre-fill room and navigate to game
        this.lobbyForm.get("roomId")?.setValue(roomId);
        this.onSubmit();
    }

    generateRoomCode() {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.lobbyForm.get("roomId")?.setValue(roomCode);
    }

    private loadRecentRooms() {
        // Implement logic to load recent rooms from local storage or service
        this.recentRooms.set(["ABCD", "EFGH", "IJKL"]);
    }
}
