import {Directive, ElementRef, HostBinding, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appRaiseCard]'
})
export class RaiseCardDirective {

  private raised = false;

  @Input() raiseLevel = 10;

  constructor(private el: ElementRef) {
  }

  @HostListener('mouseenter')
  addRaisedClass() {
    const classList = this.el.nativeElement.classList;
    console.log(classList);
    this.el.nativeElement.classList.add('mat-elevation-z' + this.raiseLevel);
  }

  @HostListener('mouseleave')
  unraise() {
    this.el.nativeElement.classList.remove('mat-elevation-z' + this.raiseLevel);
  }

}
