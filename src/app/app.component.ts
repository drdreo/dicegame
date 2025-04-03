import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ConnectionStatusComponent } from "./shared/connection-status/connection-status.component";

@Component({
    selector: "app-root",
    template: `
        <router-outlet></router-outlet>
        <connection-status />
    `,
    imports: [RouterOutlet, ConnectionStatusComponent]
})
export class AppComponent {}
