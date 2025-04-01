import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GameService } from "../shared/game.service";

@Component({
    selector: "app-home",
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
    recentRooms = signal<string[]>([]);
    private readonly gameService = inject(GameService);
    private readonly fb = inject(FormBuilder);
    lobbyForm = this.fb.group({
        playerName: ["", [Validators.required, Validators.minLength(2)]],
        roomId: [""],
    });
    private readonly router = inject(Router);

    constructor() {
        this.gameService.joined$.pipe(takeUntilDestroyed()).subscribe(({ roomId }) => {
            console.log("Joined room:", roomId);
            this.router.navigate(["/room", roomId]);
        });
    }

    ngOnInit() {
        this.loadRecentRooms();
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

    private loadRecentRooms() {
        // Implement logic to load recent rooms from local storage or service
        this.recentRooms.set(["ABCD", "EFGH", "IJKL"]);
    }
}
