import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";

export const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "test", loadComponent: () => import("./dice-test/dice-test.component").then((m) => m.DiceTestComponent) },
    { path: "room/:roomId", loadComponent: () => import("./room/room.component").then((m) => m.RoomComponent) },
    { path: "**", redirectTo: "home", pathMatch: "full" }
];
