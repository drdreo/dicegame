import { ApplicationRef, createComponent, inject, Injectable } from "@angular/core";
import { NotificationComponent } from "./notification.component";

@Injectable({
    providedIn: "root"
})
export class NotificationService {
    private readonly appRef = inject(ApplicationRef);

    notify(message: string) {
        const componentRef = createComponent(NotificationComponent, {
            environmentInjector: this.appRef.injector,
            hostElement: document.createElement("div")
        });

        componentRef.setInput("message", message);
        const sub = componentRef.instance.onClose.subscribe(() => {
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
            sub.unsubscribe();
        });

        document.body.appendChild(componentRef.location.nativeElement);
        this.appRef.attachView(componentRef.hostView);

        setTimeout(() => {
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        }, 3500); // Auto close after 3.5 seconds
    }
}
