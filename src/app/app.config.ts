import {
    APP_INITIALIZER,
    ApplicationConfig,
    ErrorHandler,
    provideExperimentalZonelessChangeDetection
} from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter, Router } from "@angular/router";
import * as Sentry from "@sentry/angular";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
    providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter(routes),
        provideAnimationsAsync(),
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler()
        },
        {
            provide: Sentry.TraceService,
            deps: [Router]
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => {},
            deps: [Sentry.TraceService],
            multi: true
        }
    ]
};
