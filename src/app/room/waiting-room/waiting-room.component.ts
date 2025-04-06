import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GameService } from "../../shared/game.service";

@Component({
    selector: "app-waiting-room",
    imports: [],
    templateUrl: "./waiting-room.component.html",
    styleUrl: "./waiting-room.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaitingRoomComponent {
    private readonly gameService = inject(GameService);

    addBot() {
        this.gameService.addBot();
    }
}
