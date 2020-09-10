import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form', {static: false}) slForm: NgForm;
  editMode = false;
  editedIndex: number;
  editedItem: Ingredient;
  private slSub: Subscription;

  constructor(private sService: ShoppingListService) { }

  ngOnInit(): void {
    this.slSub = this.sService.editing.subscribe((index: number) => {
      this.editedIndex = index;
      this.editMode = true;
      this.editedItem = this.sService.getIngredient(index);
      this.slForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      });
    })
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.sService.updateIngredient(this.editedIndex, newIngredient)
    } else {
      this.sService.addIngredient(newIngredient);
    }

    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.slForm.reset();
  }

  onDelete() {
    this.sService.deleteIngredient(this.editedIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.slSub.unsubscribe();
  }
}
