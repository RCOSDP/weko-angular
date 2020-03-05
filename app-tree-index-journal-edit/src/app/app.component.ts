import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { TreeModel } from '../../ng2-tree/src/tree.types';

@Component({
  selector: 'app-root-tree-hensyu',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // display journal Flag: 0-Index Edit (not journal), 1- Journal
  @Input()
  public journalDisplayFlg: string = "0";
  constructor(private elementRef:ElementRef) {
    this.journalDisplayFlg = this.elementRef.nativeElement.getAttribute('journalDisplayFlg');
  }
  ngOnInit(): void{
  }
}
