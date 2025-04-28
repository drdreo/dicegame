import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideDot } from "@ng-icons/lucide";
import { GameService } from "../shared/game.service";
import { InstructionsHelpComponent } from "../shared/instructions/instructions-help/instructions-help.component";
import { DialogService } from "../shared/notifications/dialog.service";
import { SocketService } from "../shared/socket.service";

@Component({
    selector: "app-home",
    imports: [FormsModule, ReactiveFormsModule, NgIcon, InstructionsHelpComponent],
    providers: [provideIcons({ lucideDot })],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    private readonly socketService = inject(SocketService);
    private readonly gameService = inject(GameService);
    private readonly notificationService = inject(DialogService);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    lobbyForm = this.fb.group({
        playerName: ["", [Validators.required, Validators.minLength(2)]],
        roomId: [""]
    });
    isConnected = computed(() => this.socketService.connectionStatus() === WebSocket.OPEN);

    roomList = this.gameService.roomList;

    constructor() {
        this.gameService.requestRoomList();
        // TODO: is this intended?
        // this.gameService.leaveRoom();

        this.gameService.joined$.pipe(takeUntilDestroyed()).subscribe(({ roomId }) => {
            console.log("Joined room:", roomId);
            this.navigateToRoom(roomId);
        });

        this.gameService.reconnected$.pipe(takeUntilDestroyed()).subscribe(({ roomId }) => {
            console.log("Reconnected to room:", roomId);
            // show notification and offer to rejoin game
            this.notificationService.notify(`Game still in progress. Rejoin '${roomId}'?`, {
                actionText: "Rejoin Game",
                onAction: () => {
                    this.navigateToRoom(roomId);
                }
            });
        });
    }

    ngOnInit() {
        this.initKofiWidget();
    }

    onSubmit() {
        if (this.lobbyForm.valid) {
            const { playerName, roomId } = this.lobbyForm.value;
            this.gameService.joinRoom(playerName!, roomId ?? undefined);
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

    navigateToRoom(roomId: string) {
        this.router.navigate(["/room", roomId]);
    }

    private initKofiWidget(): void {
        const kofiOverlay = (window as any).kofiWidgetOverlay;
        if (typeof kofiOverlay !== "undefined") {
            kofiOverlay.draw(
                "drdreo",
                {
                    type: "floating-chat",
                    "floating-chat.donateButton.text": "Buy me a kofi",
                    "floating-chat.donateButton.background-color": "#fcbf47",
                    "floating-chat.donateButton.text-color": "#323842"
                },
                "kofi-container"
            );
        } else {
            setTimeout(() => this.initKofiWidget(), 1000);
        }
    }
}
