import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { DiceBoardComponent } from "../dice-board/dice-board.component";
import { GameService } from "../shared/game.service";

@Component({
    selector: "app-room",
    imports: [DiceBoardComponent],
    templateUrl: "./room.component.html",
    styleUrl: "./room.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomComponent {
    private readonly gameService = inject(GameService);
}
