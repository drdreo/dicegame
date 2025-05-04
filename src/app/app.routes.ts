import { Routes } from "@angular/router";
import { DiceTestComponent } from "./dice-test/dice-test.component";
import { HomeComponent } from "./home/home.component";
import { RoomComponent } from "./room/room.component";

export const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "test", component: DiceTestComponent },
    { path: "room/:roomId", component: RoomComponent },
    { path: "**", redirectTo: "home", pathMatch: "full" }
];
