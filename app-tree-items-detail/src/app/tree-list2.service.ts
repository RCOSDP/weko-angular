import { Injectable } from '@angular/core';
import { TreeModel } from '../../ng2-tree/src/tree.types';
import { Http,RequestOptions,Response, Headers} from '@angular/http';
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
    // const currentTime = new Date().getTime();
    if(inx != -1){
      for(let i=0;i<urlArr.length;i++){
        if(urlArr[i]=='communities'){
          comm_ide = urlArr[i+1];
          break;
        }
      }
      if(moreNodes != null){
        hrl = hostUrl + "/api/tree?action=browsing&community="+comm_ide+"&more_ids="+moreNodes;
      }else{
        hrl = hostUrl + "/api/tree?action=browsing&community="+comm_ide ;
      }

    }else if($("#community")!=undefined && $("#community").val()){
      comm_ide = $("#community").val();
      console.log(comm_ide)
      if(moreNodes != null){
        hrl = hostUrl+"/api/tree?action=browsing&community="+comm_ide+"&more_ids="+moreNodes ;
      }else{
        hrl = hostUrl+"/api/tree?action=browsing&community="+ comm_ide;
      }

    }else{
      if(moreNodes != null){
        hrl = hostUrl+"/api/tree?action=browsing&more_ids="+ moreNodes;
      }else{
        hrl = hostUrl+"/api/tree?action=browsing";
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
  getDefaultSettingSearch(url) {
    return this.http.get(url + "/get_search_setting")
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  async setSearchNodeId(url:any,nodeId:any){
    var urlArr = window.location.href.split('/');
    let hostUrl = urlArr[0]+"//"+urlArr[2];
    // const currentTime = new Date().getTime();
    // Community edit
    if(window.location.href.indexOf(hostUrl+"/communities/") != -1 &&
      window.location.href.indexOf("/edit/") != -1){
        return;
    }
    let search = ""
    let reponse = this.getDefaultSettingSearch(hostUrl);
    search = this.insertParam(search, "search_type", "2")
    search = this.insertParam(search, "q", String(nodeId))
    // search = this.insertParam(search, "time", String(currentTime))
    
    let data = {
      "dlt_dis_num_selected": "",
      "dlt_index_sort_selected": "",
      "dlt_keyword_sort_selected": "" };
    await reponse.then(reponse => {
      if (reponse.status === 1) {
        data = { 
          "dlt_dis_num_selected": reponse.data.dlt_dis_num_selected,
          "dlt_index_sort_selected": reponse.data.dlt_index_sort_selected,
          "dlt_keyword_sort_selected": reponse.data.dlt_keyword_sort_selected, };
      }});
    if (search.indexOf("size") !== -1) {
      search = this.insertParam(search, "size", data.dlt_dis_num_selected);
    } else {
      search = this.insertParam(search + "&size=null", "size", data.dlt_dis_num_selected);
    }
    let index_search = data.dlt_index_sort_selected;
    if (index_search.indexOf("_asc") !== -1) {
      index_search=index_search.replace("_asc", "");
    }
    if (index_search.indexOf("_desc") !== -1) {
      index_search=index_search.replace("_desc", "");
      index_search="-" + index_search;
    }
    if (search.indexOf("sort") !== -1) {
      search = this.insertParam(search, "sort", index_search);
    } else {
      search = this.insertParam(search + "&sort=null", "sort", index_search);
    }

    if($("#community")!=undefined && $("#community").val()){
      let community = $("#community").val();
      search = this.insertParam(search, "community", String(community))
    }
    if($("#item_management_custom_sort").length!=0){
      let geturl = hostUrl + "/admin/items/search?search_type=2&q="+ nodeId+"&item_management=sort&sort=custom_sort";
      return window.location.assign(geturl);
    }
    if($("#item_management_bulk_update").length!=0){
      let geturl = hostUrl + "/admin/items/search?search_type=2&q="+ nodeId+"&item_management=update";
      return window.location.assign(geturl);

    }
    if($("#item_management_bulk_delete").length!=0){
      let geturl = hostUrl + "/admin/items/search?search_type=2&q="+ nodeId+"&item_management=delete&sort=custom_sort";
      return window.location.assign(geturl);
    }
    if($("#item_link").length!=0){
      let activity_id = $("#item_link").text();
      search = this.insertParam(search, "item_link", activity_id)
    }else {
      let searchParam = (window as any).facetSearchFunctions && (window as any).facetSearchFunctions.getFacetSearchCondition ?
        (window as any).facetSearchFunctions.getFacetSearchCondition() : new URLSearchParams();
      let appendSearchParam = new URLSearchParams(search);
      searchParam.set('search_type', appendSearchParam.get('search_type'));
      searchParam.set('q', appendSearchParam.get('q'));
      if((window as any).invenioSearchFunctions && (window as any).invenioSearchFunctions.reSearchInvenio){
        (window as any).invenioSearchFunctions.reSearchInvenio(searchParam);
      }else{
        window.location.assign("/search?"+ searchParam);
      }
      return;
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