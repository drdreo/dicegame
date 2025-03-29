import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-game-stats",
    imports: [],
    templateUrl: "./game-stats.component.html",
    styleUrl: "./game-stats.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameStatsComponent {}
