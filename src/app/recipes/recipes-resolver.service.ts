import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService  implements Resolve<Recipe[]>{

  constructor(private dsService: DataStorageService, private rService: RecipeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    const recipes = this.rService.getRecipes();

    if (recipes.length === 0) {
      return this.dsService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
