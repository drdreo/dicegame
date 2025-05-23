import { ApplicationRef, ComponentRef, createComponent, inject, Injectable, Type } from "@angular/core";
import { isDescendant } from "../utils";
import { BustedNotificationComponent } from "./busted-notification.component";
import { NotificationComponent } from "./notification.component";
import { WinnerNotificationComponent } from "./winner-notification.component";

type CSSProperties = {
    [key: string]: string | number;
};

type DialogOptions = {
    styles?: CSSProperties;
};

@Injectable({
    providedIn: "root"
})
export class DialogService {
    private readonly appRef = inject(ApplicationRef);
    private openDialogs = new Map<Type<any>, ComponentRef<any>>();

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
            this.destroyComponent(componentRef);
        });

        if (options?.onAction) {
            componentRef.instance.onAction.subscribe(() => {
                options.onAction?.();
                this.destroyComponent(componentRef);
            });
        }

        document.body.appendChild(componentRef.location.nativeElement);
        this.appRef.attachView(componentRef.hostView);

        if (options?.autoClose) {
            setTimeout(() => {
                this.destroyComponent(componentRef);
            }, options.autoClose);
        }
    }

    showBusted(playerName: string) {
        const componentRef = createComponent(BustedNotificationComponent, {
            environmentInjector: this.appRef.injector,
            hostElement: document.createElement("div")
        });

        componentRef.setInput("player", playerName);

        document.body.appendChild(componentRef.location.nativeElement);
        this.appRef.attachView(componentRef.hostView);

        setTimeout(() => {
            this.destroyComponent(componentRef);
        }, 3500);
    }

    showWinner(name: string, hostElement: HTMLElement) {
        const componentRef = createComponent(WinnerNotificationComponent, {
            environmentInjector: this.appRef.injector,
            hostElement: document.createElement("div")
        });

        componentRef.setInput("winner", name);

        hostElement.appendChild(componentRef.location.nativeElement);
        this.appRef.attachView(componentRef.hostView);

        return componentRef;
    }

    openComponent<T>(component: Type<T>, { styles }: DialogOptions): ComponentRef<T> | undefined {
        if (this.openDialogs.has(component)) {
            return;
        }

        const hostElement = document.createElement("div");
        this.applyStyles(hostElement, styles);
        const componentRef = createComponent(component, {
            environmentInjector: this.appRef.injector,
            hostElement
        });

        document.body.appendChild(componentRef.location.nativeElement);

        this.appRef.attachView(componentRef.hostView);

        this.openDialogs.set(component, componentRef);

        const escHandler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                this.destroyComponent(componentRef);
            }
        };

        document.addEventListener("keydown", escHandler);

        const clickHandler = (event: MouseEvent) => {
            const isDesc = isDescendant(hostElement, event.target as HTMLElement);
            if (!isDesc) {
                this.destroyComponent(componentRef);
            }
        };

        // Delay attaching the click handler to avoid instant closing
        setTimeout(() => {
            document.addEventListener("click", clickHandler);
        }, 0);

        const originalDestroy = componentRef.destroy.bind(componentRef);
        componentRef.destroy = () => {
            document.removeEventListener("keydown", escHandler);
            document.removeEventListener("click", clickHandler);
            this.openDialogs.delete(component);

            originalDestroy();
        };

        return componentRef;
    }

    destroyComponent<T>(componentRef: ComponentRef<T>): void {
        try {
            // Find and remove from open dialogs map if present
            for (const [component, ref] of this.openDialogs.entries()) {
                if (ref === componentRef) {
                    this.openDialogs.delete(component);
                    break;
                }
            }

            this.appRef.detachView(componentRef.hostView);

            const element = componentRef.location.nativeElement;
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }

            componentRef.destroy();
        } catch (error) {
            console.error("Error destroying component:", error);
        }
    }

    closeAll(): void {
        this.openDialogs.forEach((ref) => this.destroyComponent(ref));
        this.openDialogs.clear();
    }

    private applyStyles(hostElement: HTMLDivElement, styles?: CSSProperties) {
        // default styles
        hostElement.style.maxWidth = "calc(100vw - 2rem)";
        hostElement.style.maxHeight = "calc(100vh - 2rem)";
        hostElement.style.overflow = "auto";
        hostElement.style.boxSizing = "border-box";
        hostElement.classList.add("dialog-host");

        // custom styles
        if (styles) {
            Object.keys(styles).forEach((key) => {
                hostElement.style[key as any] = styles[key] as string;
            });
        }
    }
}
