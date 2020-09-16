import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AlertComponent } from "../shared/alert/alert.component";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private alertSub: Subscription;
  private storeSub: Subscription;

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  constructor(
    private cfr: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
    }

    form.reset();
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.cfr.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.alertSub = componentRef.instance.close.subscribe(() => {
      this.onHandleError();
      this.alertSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy() {
    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
