import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';

import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  private rSub: Subscription;

  constructor(
    private rService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.rSub = this.rService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });

    this.recipes = this.rService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(["new"], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.rSub.unsubscribe();
  }
}
