import { Component,OnInit,Input,Output, ElementRef } from '@angular/core';
import { TreeModel } from '../../ng2-tree/src/tree.types';

@Component({
  selector: 'app-tree-items',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  public myAttribute:string=''
  constructor(private elementRef:ElementRef) {
    this.myAttribute = this.elementRef.nativeElement.getAttribute('inputFlg');
  }

  ngOnInit() {
  }

}
