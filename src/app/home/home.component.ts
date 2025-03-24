import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GameService } from "../shared/game.service";

@Component({
    selector: "app-home",
    imports: [],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    private readonly gameService = inject(GameService);
}
