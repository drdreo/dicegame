import { bootstrapApplication } from "@angular/platform-browser";
import * as Sentry from "@sentry/angular";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";
import { environment } from "./environments/environment";

if (environment.stage === "production") {
    Sentry.init({
        environment: environment.stage,
        dsn: "https://0dece51e20a4b698aa015b100fed0549@o528779.ingest.us.sentry.io/4509264555868160",
        sendDefaultPii: true
    });
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
