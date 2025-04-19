import { ApplicationRef, createComponent, inject, Injectable } from "@angular/core";
import { NotificationComponent } from "./notification.component";

@Injectable({
    providedIn: "root"
})
export class NotificationService {
    private readonly appRef = inject(ApplicationRef);

    notify(
        message: string,
        options?: {
            actionText?: string;
            onAction?: () => void;
            autoClose?: number;
        }
    ) {
        const componentRef = createComponent(NotificationComponent, {
            environmentInjector: this.appRef.injector,
            hostElement: document.createElement("div")
        });

        componentRef.setInput("message", message);
        if (options?.actionText) {
            componentRef.setInput("actionText", options.actionText);
        }

        componentRef.instance.onClose.subscribe(() => {
            this.destroyNotification(componentRef);
        });

        if (options?.onAction) {
            componentRef.instance.onAction.subscribe(() => {
                options.onAction?.();
                this.destroyNotification(componentRef);
            });
        }

        document.body.appendChild(componentRef.location.nativeElement);
        this.appRef.attachView(componentRef.hostView);

        if (options?.autoClose) {
            setTimeout(() => {
                this.destroyNotification(componentRef);
            }, options.autoClose);
        }
    }

    private destroyNotification(componentRef: any) {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }
}
