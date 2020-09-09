import { Directive, HostBinding, ElementRef, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {
  @HostBinding('class.open') isOpen: boolean;

  constructor(private elRef: ElementRef) { }

  ngOnInit() {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event']) toggleOpen(eventData: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
}
