import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TreeModel, NodeEvent, NodeMenuItemAction, TreeModelSettings, Ng2TreeSettings } from 'ng2-tree';
import { TreeList2Service } from '../tree-list2.service';
import { isJsObject } from '@angular/core/src/change_detection/change_detection_util';
import { Response } from '@angular/http/src/static_response';
import { Tree } from 'ng2-tree/src/tree';
import * as $ from 'jquery';

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
    value: "",
    id: "",
    children: []
  };

  //s選択したnodeの情報（サービス用）
  private checkedList: any[] = [];
  private nodeIdList: any[] = [];
  //選択したNode情報（表示用）
  private nodeURL: string = "";
  public serviceReturnData: any = {
    "metadata":{
      "path":[]
    },
    "status":0
  };
  //i18n 
  public langJson = {
    Index_Tree:[],
    Designate_Index: [],
    Send: [],
    Save: []
  };

  constructor(private treeList2Service: TreeList2Service) {
  }

  ngOnInit() {
    
    this.setI18n();
    //チェックボックスあるかを設定する
    if (this.templflg == '0') {
      this.checkboxSettings = {
        rootIsVisible: true,
        showCheckboxes: false
      };
    } else {
      this.checkboxSettings = {
        rootIsVisible: false,
        showCheckboxes: true
      };
    }
    // サービスを呼び出す
    this.treeList2Service.getTreeInfo().then(arr => {
      this.treeH = {
        value: "RootNode",
        id: "0",
        children: arr
      }
      //編集する場合
      this.getCkedNodeListInit();
    });
  }

  ngAfterViewInit(): void {
    this.setCheckList();
  }
  /**
   * i18n
   */
  setI18n() {
    let lang = $("#lang-code",parent.document).val();
    if(lang===undefined){
      lang = "en"
    }
    let js = document.scripts;
    let jsUrl = js[js.length - 1].src;
    let strUrl = jsUrl.substring(0, jsUrl.lastIndexOf('static'));
    let jsonUrl = strUrl + "static/json/weko_items_ui/translations/" + lang + "/messages.json";
    this.treeList2Service.getLnagJson(jsonUrl).then(res => {
      this.langJson = res;
    }).catch(

    );
  }

  /**
   * チェックしたNodeを取得する
   */
  getCheckedNode(val: TreeModel) {
    for (let d of val.checkedChildren) {
      this.setNodeList(d);
    }
    if (val.children.length != 0) {
      for (let d of val.children) {
        this.getCheckedNode(d);
      }
    }

  }
  /**
   * チェックしたnode
   */
  setCheckList() {
    //Node情報を再設定
    this.checkedList = [];
    this.nodeIdList = [];
    if (this.treeList.tree.checked) {
      this.setNodeList(this.treeList.tree)
    }
    this.getCheckedNode(this.treeList.tree);
  }
  /**
   * サービスitems詳細画面の送信ボタン
   */
  sending() {
    let post_url = document.getElementById('post_url').innerText;
    let post_success_url = document.getElementById('post_success_url').innerText;
    let post_error_url = document.getElementById('post_error_url').innerText;
    // let jsonStr ={"index":this.nodeIdList,"actions" :"publish"}
    // private 
    let jsonStr ={"index":this.nodeIdList,"actions" :"private"}
    this.treeList2Service.setCheckedNode(post_url, jsonStr).then(res =>{
                                          //一旦設定
                                          if(post_success_url==""&&post_error_url==""){
                                            let urlArr = window.location.href.split('/');
                                            let url = urlArr[0]+"//"+urlArr[2]+"/items";
                                            window.location.href = url;
                                          }else if(post_success_url!=""){
                                            window.location.href = post_success_url;
                                          }else{
                                            window.location.href = post_error_url;
                                          }
                                           
                                         }).catch(res=>{
                                           alert(res.statusText);
                                         });
  }
  /**
   * save button process
   */
  save(){
    let post_url = document.getElementById('post_url').innerText;
    let post_success_url = document.getElementById('post_success_url').innerText;
    let post_error_url = document.getElementById('post_error_url').innerText;
    let jsonStr ={"index":this.nodeIdList,"actions" :"private"}
    this.treeList2Service.setCheckedNode(post_url, jsonStr).then(res =>{
                                          //一旦設定
                                          if(post_success_url==""&&post_error_url==""){
                                            let urlArr = window.location.href.split('/');
                                            let url = urlArr[0]+"//"+urlArr[2]+"/items";
                                            window.location.href = url;
                                          }else if(post_success_url!=""){
                                            window.location.href = post_success_url;
                                          }else{
                                            window.location.href = post_error_url;
                                          }
                                         }).catch(res=>{
                                          alert(res._body.message);
                                         });
  }
  /**
   * サービスインデックス編集画面の送信ボタン
   */
  sendingIndex() {
    this.treeList2Service.setTreeInfo(this.treeList.tree)
  }
  /**
   * チェックボックスを選択したNode情報を設定する
   */
  setNodeList(val: any) {
    let subList = { id: "", value: "" };
    subList.id = val.id;
    subList.value = val.value;
    this.checkedList.push(subList);
    this.nodeIdList.push(val.id);
  }
  /**
   * 画面初期に選択したNodeの項目名をリストに設定する
   */
  getCkedNodeListInit(){
    this.checkedList = [];
    this.nodeIdList = [];
    this.getCheckedNodeInit(this.treeH);
  }
  /**
   * チェックしたNodeを取得する
   */
  getCheckedNodeInit(val: TreeModel) {
    for (let d of val.children) {
      if(d.settings.checked){
        this.setNodeList(d);
      }
      if(d.children.length !=0 ){
        this.getCheckedNodeInit(d);
      }
    }
  }
}
