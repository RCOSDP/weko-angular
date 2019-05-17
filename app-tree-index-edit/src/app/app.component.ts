import { Component,OnInit, Input, ElementRef } from '@angular/core';
import { TreeModel } from 'ng2-tree/src/tree.types';

@Component({
  selector: 'app-root-tree-hensyu',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // selected node ID - index_id
  @Input()
  public nodeId: any = "";
  constructor(private elementRef:ElementRef) {
    this.nodeId = this.elementRef.nativeElement.getAttribute('nodeId');
  }
  
  ngOnInit(): void{
  }
}
