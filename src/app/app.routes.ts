import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { RoomComponent } from "./room/room.component";

export const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "room/:roomId", component: RoomComponent },
    { path: "**", redirectTo: "home", pathMatch: "full" }
];
