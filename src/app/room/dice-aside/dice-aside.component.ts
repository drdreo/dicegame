import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideDice1, lucideDice2, lucideDice3, lucideDice4, lucideDice5, lucideDice6 } from "@ng-icons/lucide";
import { GameService } from "../../shared/game.service";

@Component({
    selector: "app-dice-aside",
    imports: [NgIcon],
    providers: [provideIcons({ lucideDice1, lucideDice2, lucideDice3, lucideDice4, lucideDice5, lucideDice6 })],
    templateUrl: "./dice-aside.component.html",
    styleUrl: "./dice-aside.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiceAsideComponent {
    private readonly gameService = inject(GameService);

    asideDice = this.gameService.setAsideDice;
}
