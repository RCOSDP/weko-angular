import { Injectable } from '@angular/core';
import { TreeModel } from '../../ng2-tree/src/tree.types';
import { Http,RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as $ from 'jquery';

@Injectable()
export class TreeList2Service {
  //
  private treeListUrl =  window.location.href;
  private headers = new Headers({ 'Content-Type': 'application/json'});
  public options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http,
  ) { }

 /**
  *最新tree情報を取得する
 */
  getTreeInfo(url: string): Promise<any> {
    //APIからtree情報を取得する
    let moreNodes = window.sessionStorage.getItem("moreNodes");
    let selNode = window.sessionStorage.getItem("selNode")

    var urlArr = window.location.href.split('/');
    let hostUrl = urlArr[0]+"//"+urlArr[2];

    let search_url = window.location.href.indexOf(hostUrl+"/search?");
    let detail_url = window.location.href.indexOf(hostUrl+"/records/");
    if(search_url == -1 && detail_url == -1){
      if(moreNodes != null && selNode == null){
        // Init Sesstion
        moreNodes = null;
        window.sessionStorage.removeItem("moreNodes");
      }
    }

    let inx = window.location.href.indexOf("communities");
    let comm_ide;
    let hrl ="";
    comm_ide = $("#community").val();
    const currentTime = new Date().getTime();
    if(inx != -1){
      for(let i=0;i<urlArr.length;i++){
        if(urlArr[i]=='communities'){
          comm_ide = urlArr[i+1];
          break;
        }
      }
      if(moreNodes != null){
        hrl = hostUrl + "/api/tree?action=browsing&community="+comm_ide+"&more_ids="+moreNodes + "&time="+ currentTime;
      }else{
        hrl = hostUrl + "/api/tree?action=browsing&community="+comm_ide + "&time="+ currentTime;
      }

    }else if($("#community")!=undefined && $("#community").val()){
      comm_ide = $("#community").val();
      console.log(comm_ide)
      if(moreNodes != null){
        hrl = hostUrl+"/api/tree?action=browsing&community="+comm_ide+"&more_ids="+moreNodes + "&time="+ currentTime;
      }else{
        hrl = hostUrl+"/api/tree?action=browsing&community="+ comm_ide + "&time="+ currentTime;
      }

    }else{
      if(moreNodes != null){
        hrl = hostUrl+"/api/tree?action=browsing&more_ids="+ moreNodes + "&time=" + currentTime;
      }else{
        hrl = hostUrl+"/api/tree?action=browsing?time=" + currentTime;
      }
    }
    return this.http.get(hrl)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
    };

  /**
   * nodeを選択した
   */
  setSearchNodeId(url:any,nodeId:any){
    var urlArr = window.location.href.split('/');
    let hostUrl = urlArr[0]+"//"+urlArr[2];
    const currentTime = new Date().getTime();

    // Community edit
    if(window.location.href.indexOf(hostUrl+"/communities/") != -1 &&
      window.location.href.indexOf("/edit/") != -1){
        return;
    }
    let search = window.location.search
    search = this.insertParam(search, "search_type", "2")
    search = this.insertParam(search, "q", nodeId)
    search = this.insertParam(search, "time", String(currentTime))
    if($("#community")!=undefined && $("#community").val()){
      let community = $("#community").val();
      search = this.insertParam(search, "community", String(community))
    }
    if($("#item_management_custom_sort").length!=0){
      search = this.insertParam(search, "item_management", "sort")
      search = this.insertParam(search, "sort", "custom_sort")
    }
    if($("#item_management_bulk_update").length!=0){
      search = this.insertParam(search, "item_management", "update")
    }
    if($("#item_management_bulk_delete").length!=0){
      search = this.insertParam(search, "item_management", "delete")
      search = this.insertParam(search, "sort", "custom_sort")
    }
    if($("#item_link").length!=0){
      let activity_id = $("#item_link").text();
      search = this.insertParam(search, "item_link", activity_id)
    }

    window.location.assign("/search"+ search);
  }

  insertParam(search: string, key: string, value: string)
  {
      key = encodeURIComponent(key); value = encodeURIComponent(value);

      var s = search;
      var kvp = key+"="+value;

      var r = new RegExp("(&|\\?)"+key+"=[^\&]*");

      s = s.replace(r,"$1"+kvp);

      if(!RegExp.$1) {s += (s.length>0 ? '&' : '?') + kvp;};

      //again, do what you will here
      return s
  }

  /**
   * エラー処理
   */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); //
    return Promise.reject(error.message || error);
  }

}
