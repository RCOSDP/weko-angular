import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { TreeModel, NodeEvent, NodeMenuItemAction, TreeModelSettings, Ng2TreeSettings, NodeMovedEvent } from 'ng2-tree';
import { TreeList2Service } from '../tree-list2.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Response } from '@angular/http/src/static_response';
import * as $ from 'jquery';

@Component({
  selector: 'app-tree-list2',
  templateUrl: './tree-list2.component.html',
  styleUrls: ['./tree-list2.component.css'],
  providers: [TreeList2Service]
})

export class TreeList2Component implements OnInit {
  @ViewChild('treeList') treeList;
  //表示様式フラグ　0:チェックボークスなし　1:チェックボークスあり
  @Input()
  public templflg: string = "0";
  // display journal Flag: 0-Index Edit (not journal), 1- Journal
  @Input()
  public journalFlg: string = "0";
  //選択したnodeIｄ
  public selNodeId: any = "";
  //settings templite
  private setting: TreeModelSettings = {};
  //treeの設定
  public checkboxSettings: Ng2TreeSettings = {};

  public hiddenNodeId: string = "hidden";
  //Tree　json
  treeH: TreeModel = {
    value: "Root Index",
    id: "0",
    children: [{value: '', id: this.hiddenNodeId}],
    settings: {
      'static': false,
      'isCollapsedOnInit': false,
      'rightMenu': false,
      'leftMenu': false,
      'cssClasses': {
        'leaf': 'weko-node-leaf',
        'empty': 'weko-node-empty'
      }     
    }
  };
  //ツリー詳細
  public detailData = {
    id: "", index_name: null, index_name_english: null, comment: "",
    public_state: false, public_date: null, recursive_public_state: false,
    more_check: false, display_no: null, have_children: false,
    browsing_role: {
      deny: [{ id: "", name: ""}],
      allow: [{ id: "", name: ""}]
    },
    contribute_role: {
      deny: [{ id: "", name: ""}],
      allow: [{ id: "", name: ""}]
    },
    browsing_group: {
      deny: [{ id: "", name: ""}],
      allow: [{ id: "", name: ""}]
    },
    contribute_group: {
      deny: [{ id: "", name: ""}],
      allow: [{ id: "", name: ""}]
    },
    recursive_browsing_role: false,
    recursive_contribute_role: false,
    recursive_browsing_group: false,
    recursive_contribute_group: false,
    
    harvest_public_state:true,
    display_format:"1",
    image_name:""
  };
  public roleModel = {
    browsing_role_able: [],
    browsing_role_unable: [],
    contribute_role_able: [],
    contribute_role_unable: []
  }
  public groupModel = {
    browsing_group_able: [],
    browsing_group_unable: [],
    contribute_group_able: [],
    contribute_group_unable: []
  }

  //詳細画面入力フラグ
  private inputFlg: boolean = false;
  //modalの表示用
  public modalStatus: any = { 'status': 'none' };
  //返す結果状態
  private res = { code: 400, msg: "", data: { count: 0 } };
  //parentNode を判断する
  public parentIsRoot: boolean = false;
  //i18n 
  public langJson = {
    Add: [],
    Delete: [],
    Index_Edit: [],
    Index_Link: [],
    Index: [],
    Japanese: [],
    English: [],
    Comment: [],
    More_Function: [],
    More_Check: [],
    More_No: [],
    Publish: [],
    Open_To_Public: [],
    Date: [],
    Set_Publish_Date_Recursively: [],
    Harvest_Publish: [],
    Harvest_Message: [],
    Browsing_Privilege: [],
    Role: [],
    Set_Role_Recursively: [],
    Authorized: [],
    Unauthorized: [],
    Group: [],
    Set_Group_Recursively: [],
    Deposit_Privilege: [],
    Display_Format: [],
    Search_Results: [],
    List: [],
    Contents_Table: [],
    File_Size: [],
    Image_Size: [],
    File_Type: [],
    Send: []
  };
  public formData:FormData = new FormData();
  private imgSrc = "";
  private uploadFlg = false;
  private privousUploadFlg = false;
  private checkFlg = false;

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
    };
    this.setIndexTree();
  }
  /**
   * 画面をロードした後に処理を行う
   */
  ngAfterViewInit(): void {}

  /**
   * 
   * setIndexTree
   */
  setIndexTree() {
    //画面初期treeを取得
    let getTreeJsonUrl = document.getElementById('get_tree_json').innerText;
    this.treeList2Service.getTreeInfo(getTreeJsonUrl).then(arr => {
      let oopNodeController = this.treeList.getControllerByNodeId("0");
      if (Array.isArray(arr) && arr.length > 0) {
        oopNodeController.setChildren(arr);
      }
    });
  }
  /**
   * i18n
   */
  setI18n() {
    let lang = $("#lang-code").val();
    let js = document.scripts;
    let jsUrl = js[js.length - 1].src;
    let strUrl = jsUrl.substring(0, jsUrl.lastIndexOf('static'));
    let jsonUrl = strUrl + "static/json/weko_index_tree/translations/" + lang + "/messages.json";
    this.treeList2Service.getLnagJson(jsonUrl).then(res => {
      this.langJson = res;
    }).catch(

    );
  }

  /**
   * Nodeを削除する
   */
  deleNode() {
    //nodeは選択されない場合
    if (this.selNodeId == null || this.selNodeId =="0") {
      return;
    }
    //選択したインデックスに子インデックスを判断する
    let oopNodeController = this.treeList.getControllerByNodeId(this.selNodeId);
    let parentNodeID = oopNodeController.tree.parent.id;
    //モデル画面を表示する
    if (parentNodeID =="0") {
      this.parentIsRoot = true;
    } else {
      this.parentIsRoot = false;
    }
    this.openModule(null);
  }
  /**
   * Nodeを削除する
   */
  deleteNode(e: any) {
    //キャンセル
    if (String(e) == "delCancle") {
      return;
      //削除を確定する場合
    } else {
      if (String(e) == "delAndMove") {
        this.treeList2Service.delOrMoveNodeInfo(this.selNodeId, "move").then(res => {
          this.setIndexTree();
          this.setRootDetailInit();
        });
      } else {
        //削除サービスを呼び出し
        this.treeList2Service.delOrMoveNodeInfo(this.selNodeId, "all").then(res => {
          this.setIndexTree();
          this.setRootDetailInit();
        });
      }
    }
  }
  /**
   * nodeを追加する
   */
  addNode() {
    let treeMdlel = this.treeList.tree.toTreeModel().children;

    // Remove hidden node of the root
    if(this.selNodeId == "0"){
      let hiddenNodeController = this.treeList.getControllerByNodeId(this.hiddenNodeId);
      if(hiddenNodeController != null){
        hiddenNodeController.remove();
      }
    }

    //node 追加
    const oopNodeController = this.treeList.getControllerByNodeId(this.selNodeId);
    let newNodeId = this.setNodeID();
    let newNode: TreeModel = {
      value: 'New Index',
      id: newNodeId,
      children: [],
      settings: {
        'static': false,
        'rightMenu': false,
        'leftMenu': false,
        'isCollapsedOnInit': false,
        'cssClasses': {
          'leaf': 'weko-node-leaf',
          'empty': 'weko-node-empty'
        }     
      }
    };
    oopNodeController.addChild(newNode);
    // node info
    let nodeJson = {
      'id': newNodeId,
      'value': newNode.value
    };
    //サービスを呼び出し
    this.updateTreeToApi(oopNodeController.tree.node.id, nodeJson);
  }
  /**
 * Nodeを選択する
 */
  seleNode(e: NodeEvent) {
    //選択したNodeIdを格納する
    this.selNodeId = e.node.id;
    if (this.journalFlg == "0") {
    this.uploadFlg = false;
    this.checkFlg = false;
    if (this.selNodeId != "0") {
      this.inputFlg = true;
      let modTreeDetailUrl = document.getElementById('mod_tree_detail').innerText + this.selNodeId;
      this.treeList2Service.getNodeInfo(modTreeDetailUrl).then(res => {
        this.detailData = res;
        if(this.detailData.image_name != ""){
          let urlArr = window.location.href.split('/');
          this.imgSrc = urlArr[0] + "//" + urlArr[2]+this.detailData.image_name;
          this.privousUploadFlg = true;
        }else{
          this.privousUploadFlg = false;
        }
        
      });
    } else {
      this.setRootDetailInit();
      }
    } else {
      var urlArr = window.location.href.split('/');
      let hostUrl = urlArr[0]+"//"+urlArr[2];
      let geturl = hostUrl + "/admin/indexjournal/" + this.selNodeId;
      window.location.assign(geturl);
    }
  }
  /**
   * root index detail
   */
  setRootDetailInit(){
    this.inputFlg = false;
    this.detailData.index_name = "Root Index";
    this.detailData.index_name_english = "Root Index";
    this.detailData.comment = "";
  }
  /**
   * 日付でNodeIDを設定する
   */
  setNodeID(): string {
    let timestamp = new Date().getTime().toString();
    return timestamp;
  }

  /**
   * サービスインデックス編集画面の送信ボタン
   */
  sendingdetail() {
    //ツリー詳細を編集＞サービスを呼び出す
    this.checkFlg = this.inputCheck();
    if(this.checkFlg){
      alert("必須入力項目を入力してください");
      return;
    }
    if(!this.moreCheck()){
      alert("Invalid display number of index.");
      return;
    }
    
    this.detailData.index_name = this.detailData.index_name.replace(/(^\s*)|(\s*$)/g, "");
    if (this.detailData.index_name == ""){
      this.detailData.index_name = null;
    }
    if(this.uploadFlg){
      this.treeList2Service.upload(this.formData,this.selNodeId).then(res=>{
        this.detailData.image_name = res.data.path;
        let urlArr = window.location.href.split('/');
        this.imgSrc = urlArr[0] + "//" + urlArr[2]+res.data.path;
        this.privousUploadFlg = true;
        this.treeList2Service.setNodeInfo(this.selNodeId, this.detailData).then(res => {
          console.log(JSON.stringify(res))
          alert(res.message);
          this.setIndexTree();
        });
      }).catch()
    }else{
      this.treeList2Service.setNodeInfo(this.selNodeId, this.detailData).then(res => {
        console.log(JSON.stringify(res))
        alert(res.message);
        this.setIndexTree();
      });
    }
  }
  /**
   *最新なのindexTreeをAPIへ送る
   @param val:更新フラグ　0:追加 1:削除
   */
  updateTreeToApi(parentId: any, treeJson: any) {
    //サービスを呼び出し
    this.treeList2Service.setTreeInfo(parentId, treeJson).then(res => {
      this.setIndexTree();
    }).catch(
      res => {
        alert(res.message);
      }
    );
  }
  /**
   * modal画面を表示する
   * @param event 
   */
  openModule(event) {
    this.modalStatus.status = 'table-cell';
  }
  /**
   * set Browsing role allow
   */
  setBrowsingDenyToAllow(val:any){
    let roleArr = val;
    for(let obj of roleArr){
      let sub = {id:"",name:""};
      sub.id = this.detailData.browsing_role.deny[obj].id;
      sub.name = this.detailData.browsing_role.deny[obj].name;
      this.detailData.browsing_role.allow.push(sub);
    }
    for(let i=roleArr.length-1;i>=0;i--){
      this.detailData.browsing_role.deny.splice(roleArr[i],1);
    }
    this.roleModel.browsing_role_unable = [];
  }
  /**
   * set Browsing role deny
   */
  setBrowsingAllowToDeny(val:any){
    let roleArr = val;
    for(let obj of roleArr){
      let sub = {id:"",name:""};
      sub.id = this.detailData.browsing_role.allow[obj].id;
      sub.name = this.detailData.browsing_role.allow[obj].name;
      this.detailData.browsing_role.deny.push(sub);
    }
    for(let i=roleArr.length-1;i>=0;i--){
      this.detailData.browsing_role.allow.splice(roleArr[i],1);
    }
    this.roleModel.browsing_role_able = [];
  }
  /**
   * set Contribute role deny
   */
  setContributeAllowToDeny(val:any){
    let roleArr = val;
    for(let obj of roleArr){
      let sub = {id:"",name:""};
      sub.id = this.detailData.contribute_role.allow[obj].id;
      sub.name = this.detailData.contribute_role.allow[obj].name;
      this.detailData.contribute_role.deny.push(sub);
    }
    for(let i=roleArr.length-1;i>=0;i--){
      this.detailData.contribute_role.allow.splice(roleArr[i],1);
    }
    this.roleModel.contribute_role_able = [];
  }
  /**
   * set Contribute role allow
   */
  setContributeDenyToAllow(val:any){
    let roleArr = val;
    for(let obj of roleArr){
      let sub = {id:"",name:""};
      sub.id = this.detailData.contribute_role.deny[obj].id;
      sub.name = this.detailData.contribute_role.deny[obj].name;
      this.detailData.contribute_role.allow.push(sub);
    }
    for(let i=roleArr.length-1;i>=0;i--){
      this.detailData.contribute_role.deny.splice(roleArr[i],1);
    }
    this.roleModel.contribute_role_unable = [];
  }
  // 20180925 add start
    /**
   * set Browsing group allow
   */
  setBrowsingGroupDenyToAllow(val:any){
    let groupArr = val;
    for(let obj of groupArr){
      let sub = {id:"",name:""};
      sub.id = this.detailData.browsing_group.deny[obj].id;
      sub.name = this.detailData.browsing_group.deny[obj].name;
      this.detailData.browsing_group.allow.push(sub);
    }
    for(let i=groupArr.length-1;i>=0;i--){
      this.detailData.browsing_group.deny.splice(groupArr[i],1);
    }
    this.groupModel.browsing_group_unable = [];
  }
  /**
   * set Browsing group deny
   */
  setBrowsingGroupAllowToDeny(val:any){
    let groupArr = val;
    for(let obj of groupArr){
      let sub = {id:"",name:""};
      sub.id = this.detailData.browsing_group.allow[obj].id;
      sub.name = this.detailData.browsing_group.allow[obj].name;
      this.detailData.browsing_group.deny.push(sub);
    }
    for(let i=groupArr.length-1;i>=0;i--){
      this.detailData.browsing_group.allow.splice(groupArr[i],1);
    }
    this.groupModel.browsing_group_able = [];
  }
  /**
   * set Contribute group deny
   */
  setContributeGroupAllowToDeny(val:any){
    let groupArr = val;
    for(let obj of groupArr){
      let sub = {id:"",name:""};
      sub.id = this.detailData.contribute_group.allow[obj].id;
      sub.name = this.detailData.contribute_group.allow[obj].name;
      this.detailData.contribute_group.deny.push(sub);
    }
    for(let i=groupArr.length-1;i>=0;i--){
      this.detailData.contribute_group.allow.splice(groupArr[i],1);
    }
    this.groupModel.contribute_group_able = [];
  }
  /**
   * set Contribute group allow
   */
  setContributeGroupDenyToAllow(val:any){
    let groupArr = val;
    for(let obj of groupArr){
      let sub = {id:"",name:""};
      sub.id = this.detailData.contribute_group.deny[obj].id;
      sub.name = this.detailData.contribute_group.deny[obj].name;
      this.detailData.contribute_group.allow.push(sub);
    }
    for(let i=groupArr.length-1;i>=0;i--){
      this.detailData.contribute_group.deny.splice(groupArr[i],1);
    }
    this.groupModel.contribute_group_unable = [];
  }
  // 20180925 add end
  /**
   * node 
   */
  handleMoved(e: NodeMovedEvent){
    // moved Node id
    let nodeId = e.node.id;
    // moved parent Node id
    let parentId = e.node.parent.id;
    let pre_parentId = e.previousParent.id;
    // new position
    let position = e.node.positionInParent;
    // moved info
    let infoJson = {
      pre_parent:pre_parentId,
      parent:parentId,
      position:position
    };
    this.treeList2Service.setNodeMoved(nodeId,infoJson).then(res =>{
      this.setIndexTree();
    }).catch(res =>{

    })
  }

  fileChange(event) {
    // this.detailData.image_name = "";
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      this.formData = new FormData();
      this.detailData.image_name = file.name;
      let str = this.selNodeId + file.name
      this.formData.append('uploadFile', file, str);
      this.uploadFlg = true;
      this.privousUploadFlg = false
    }else{
      this.detailData.image_name ="";
      this.uploadFlg = false;
    }
  }
  /**
   * 入力チェック
   */
  inputCheck():boolean{
    let str = this.detailData.index_name_english;
    str = str.replace(/(^\s*)|(\s*$)/g, "")
    if(str ==""){
      return true;
    }else{
      return false;
    }
  }

  /**
   * Display Number Check
   */
  moreCheck():boolean{
    if(this.detailData.more_check) {
      if(this.detailData.display_no == null || 
        isNaN(this.detailData.display_no) || 
        this.detailData.display_no <= 0){
        return false;
      }
    }
    return true;
  }
}
