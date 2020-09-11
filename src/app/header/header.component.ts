import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { Subscription } from 'rxjs';

import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  private aSub: Subscription;

  constructor(
    private dsService: DataStorageService,
    private aService: AuthService
  ) {}

  ngOnInit(): void {
    this.aSub = this.aService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.dsService.storeRecipes();
  }

  onFetchData() {
    this.dsService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.aService.logout();
  }

  ngOnDestroy() {
    this.aSub.unsubscribe();
  }
}
