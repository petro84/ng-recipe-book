import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap, take, exhaustMap } from "rxjs/operators";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private rService: RecipeService,
    private aService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.rService.getRecipes();

    this.http
      .put("https://recipe-book-ng-13ce2.firebaseio.com/recipes.json", recipes)
      .subscribe((response) => console.log(response));
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>("https://recipe-book-ng-13ce2.firebaseio.com/recipes.json")
      .pipe(map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => this.rService.setRecipes(recipes))
    );
  }
}
