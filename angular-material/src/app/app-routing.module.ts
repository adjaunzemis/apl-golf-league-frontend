import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";

const routes: Routes = [
  { path: "", component: AppComponent },
  { path: "flights", component: AppComponent },
  { path: "tournaments", component: AppComponent },
  { path: "courses", component: AppComponent },
  { path: "players", component: AppComponent },
  { path: "teams", component: AppComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
