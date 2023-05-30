import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TreeModel, NodeEvent, NodeMenuItemAction, TreeModelSettings, Ng2TreeSettings } from '../../../ng2-tree';
import { TreeList2Service } from '../tree-list2.service';
import { isJsObject } from '@angular/core/src/change_detection/change_detection_util';
import { Response } from '@angular/http/src/static_response';
import { Tree } from '../../../ng2-tree/src/tree';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';


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

  //redirect flag
  public redirectFlag: any = {'flag': 'F'}
  //modalの表示用
  public modalStatus: any = { 'status': 'none' };
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
    children: [],
    settings: {
      'static': true
    }
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
    Back: [],
    Send: [],
    Save: [],
    Quit: []
  };
  public isDisabledSave = false;
  public isDisabledSend = false;

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
        children: arr,
        settings: {
          'static': true
        }
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
    this.isDisabledSend = true;
    $(".lds-ring-background").removeClass("hidden");
    let post_url = document.getElementById('post_url').innerText;
    let pub_status = document.getElementById('pub_status').innerText;
    let post_success_url = document.getElementById('post_success_url').innerText;
    let post_error_url = document.getElementById('post_error_url').innerText;
    // let jsonStr ={"index":this.nodeIdList,"actions" :"publish"}
    // private
    if (this.nodeIdList.length == 0) {
      this.isDisabledSend = false;
      $(".lds-ring-background").addClass("hidden");
      this.modalStatus.status = 'table-cell';
      $('.modal-body').html('At least one index should be selected.');
      return;
    }
    let jsonStr ={"index":this.nodeIdList,"actions": pub_status}
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
                                          this.isDisabledSend = false;
                                          $(".lds-ring-background").addClass("hidden");
                                          let msg = JSON.parse(res._body);
                                          this.modalStatus.status = 'table-cell';
                                          if (msg.message == "MAPPING_ERROR") {
                                            $('.modal-body').html('Please make sure the item type mapping is correct.');
                                            this.redirectFlag.flag = 'T';
                                          } else {
                                            $('.modal-body').html('Server Error. Please reload this page.');
                                          }
                                         });
  }
  /**
   * save button process
   */
  save() {
    this.isDisabledSave = true;
    $(".lds-ring-background").removeClass("hidden");
    let post_url = document.getElementById('post_url').innerText;
    let pub_status = document.getElementById('pub_status').innerText;
    if (this.nodeIdList.length == 0) {
      this.isDisabledSave = false;
      $(".lds-ring-background").addClass("hidden");
      this.modalStatus.status = 'table-cell';
      $('.modal-body').html('At least one index should be selected.');
      return;
    }
    let jsonStr = { "index": this.nodeIdList, "actions": pub_status, "is_save_path": true }
    this.treeList2Service.setCheckedNode(post_url, jsonStr).then(res => {
      this.isDisabledSave = false;
      $(".lds-ring-background").addClass("hidden");
      $('#alerts').append(
        '<div id="alert-style" class="alert alert-light">' +
        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">' +
        '&times;</button>' + 'Model save success' + '</div>');
    }).catch(res => {
      this.isDisabledSave = false;
      $(".lds-ring-background").addClass("hidden");
      let msg = JSON.parse(res._body);
      this.modalStatus.status = 'table-cell';
      if (msg.message == "MAPPING_ERROR") {
        $('.modal-body').html('Please make sure the item type mapping is correct.');
        this.redirectFlag.flag = 'T';
      } else {
        $('.modal-body').html('Server Error. Please reload this page.');
      }
    });
  }
  /**
   * back button process
   */
  back() {
    let origin = new URL(window.location.href).origin;
    let redirect_uri = origin + "/workflow/activity/detail/" + $("#activity_id_text").text().trim();
    document.location.href = redirect_uri;
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
