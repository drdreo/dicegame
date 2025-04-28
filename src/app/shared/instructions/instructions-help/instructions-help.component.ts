import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCircleHelp } from "@ng-icons/lucide";
import { DialogService } from "../../notifications/dialog.service";
import { InstructionsComponent } from "../instructions.component";

@Component({
    selector: "game-instructions-help",
    imports: [NgIcon],
    providers: [provideIcons({ lucideCircleHelp })],
    templateUrl: "./instructions-help.component.html",
    styleUrl: "./instructions-help.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructionsHelpComponent {
    private notificationService = inject(DialogService);

    openInstructions() {
        const compRef = this.notificationService.openComponent(InstructionsComponent, {
            styles: {
                position: "absolute",
                top: "1rem",
                left: "1rem"
            }
        });
        compRef.instance.onClose.subscribe(() => {
            console.log("Instructions closed");
            this.notificationService.destroyComponent(compRef);
        });
    }
}
