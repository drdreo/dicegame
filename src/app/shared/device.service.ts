import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class DeviceService {
    // @ts-ignore
    isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
