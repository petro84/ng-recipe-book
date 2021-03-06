import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private slSub: Subscription;

  constructor(private sService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.sService.getIngredients();

    this.slSub = this.sService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
    })
  }

  onEdit(index: number) {
    this.sService.editing.next(index);
  }

  ngOnDestroy() {
    this.slSub.unsubscribe();
  }
}
