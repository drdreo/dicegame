import { DOCUMENT } from "@angular/common";
import { inject, Injectable } from "@angular/core";
import { EventManager } from "@angular/platform-browser";
import { filter, Observable, Subject, takeUntil } from "rxjs";

type HotkeyCallback = (event: KeyboardEvent) => void;

@Injectable({
    providedIn: "root"
})
export class HotkeyService {
    private readonly eventManager = inject(EventManager);
    private readonly dispose = new Subject<string>();
    private document = inject(DOCUMENT);
    private callbacks: HotkeyCallback[] = [];

    addShortcut(keys: string): Observable<KeyboardEvent> {
        const event = `keydown.${keys}`;
        return new Observable<KeyboardEvent>((observer) => {
            const handler = (e: KeyboardEvent) => {
                this.callbacks.forEach((cb) => cb(e));
                observer.next(e);
            };

            const dispose = this.eventManager.addEventListener(this.document.documentElement, event, handler);

            return () => {
                dispose();
            };
        }).pipe(takeUntil(this.dispose.pipe(filter((v) => v === keys))));
    }

    removeShortcut(keys: string): void {
        this.dispose.next(keys);
    }
}
