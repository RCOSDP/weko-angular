import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TreeModel, NodeEvent, NodeMenuItemAction, TreeModelSettings, Ng2TreeSettings } from '../../../ng2-tree';
import { TreeList2Service } from '../tree-list2.service';
import { isJsObject } from '@angular/core/src/change_detection/change_detection_util';
import { Response } from '@angular/http/src/static_response';
import { Tree } from '../../../ng2-tree/src/tree';

@Component({
  selector: 'app-tree-list2',
  templateUrl: './tree-list2.component.html',
  styleUrls: ['./tree-list2.component.css'],
  providers: [TreeList2Service]
})

export class TreeList2Component implements OnInit {
  //
  @ViewChild('treeList') treeList;

  //表示様式フラグ　0:チェックボークスなし　1:チェックボークスあり
  @Input()
  public templflg: string = "0";

  //選択したnodeIｄ
  public selNodeId: any = "";
  //settings templite
  private setting: TreeModelSettings = {};
  //treeの設定
  public checkboxSettings: Ng2TreeSettings = {};
  //Tree　json
  public treeH: TreeModel = {
    value: "RootNode",
    id: 1,
    children: [],
    settings: {
      'static': true
    }
  };

  constructor(private treeList2Service: TreeList2Service) {
  }

  ngOnInit() {
    // Init select status
    let selNode = window.sessionStorage.getItem("selNode");
    if(selNode != null){
      window.sessionStorage.removeItem("selNode");
    }
    
    //チェックボックスあるかを設定する
    this.checkboxSettings = {
      rootIsVisible: false,
      showCheckboxes: false
    };
    //RootNodeを設定する
    this.treeH = {
      "value": "RootNode",
      "id": 1,
      "children": [],
      "settings": {
        'static': true,
        'rightMenu': true,
        'leftMenu': true,
        'isCollapsedOnInit': false,
        'cssClasses': {
          'leaf': 'weko-node-leaf',
          'empty': 'weko-node-empty'
        }
      }
    };
    this.treeList.tree = this.treeH;
    //画面初期treeを取得
    // let getTreeJsonUrl = document.getElementById('get_tree_json').innerText;
    let getTreeJsonUrl = "null";
    this.treeList2Service.getTreeInfo(getTreeJsonUrl).then(arr => {
      //取得したデータを表示する
      this.treeH = {
        "value": "RootNode",
        "id": 1,
        "children": arr,
        "settings": {
          'static': true,
          'rightMenu': true,
          'leftMenu': true,
          'isCollapsedOnInit': false,
          'cssClasses': {
            'leaf': 'weko-node-leaf',
            'empty': 'weko-node-empty'
          }
        }
      };
      this.treeList.tree = this.treeH;
      let nodeController = this.treeList.getControllerByNodeId(1);
      nodeController.reloadChildren();
    });
    
  }

  ngAfterViewInit(): void {}
  
  /**
 * Nodeを選択する
 */
  seleNode(e: NodeEvent) {
    if(e.node.id == "more"){
      // Add parent id to session
      let parentId = e.node.parent.id.toString();

      let moreNodes = window.sessionStorage.getItem("moreNodes");
      if(moreNodes == null){
        window.sessionStorage.setItem("moreNodes", parentId);
      }else{
        window.sessionStorage.setItem("moreNodes", moreNodes + "/" + parentId);
      }

      let selNode = window.sessionStorage.getItem("selNode");
      if(selNode == null){
        window.sessionStorage.setItem("selNode", "true");
      }
      
      let getTreeJsonUrl = "null";
      this.treeList2Service.getTreeInfo(getTreeJsonUrl).then(arr => {
        this.treeH = {
          "value": "RootNode",
          "id": 1,
          "children": arr,
          "settings": {
            'static': true,
            'rightMenu': true,
            'leftMenu': true,
            'isCollapsedOnInit': false,
            'cssClasses': {
              'leaf': 'weko-node-leaf',
              'empty': 'weko-node-empty'
            }
          }
        };
        this.treeList.tree = this.treeH;
        let oopNodeController = this.treeList.getControllerByNodeId(parentId);
        oopNodeController.reloadChildren();
      });
      
      return;
    }

    //選択したNodeIdを格納する
    this.selNodeId = e.node.id;
    //サービスを呼び出し
    this.treeList2Service.setSearchNodeId(null, this.selNodeId);
  }
}
