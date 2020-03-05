import { Injectable } from '@angular/core';
import { TreeModel } from '../../ng2-tree/src/tree.types';
import { Http,RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TreeList2Service {
  //
  private treeListUrl =  window.location.href;
  private headers = new Headers({ 'Content-Type': 'application/json'});
  public options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http,
  ) { }

  /**
   * 選択したNODEの情報を取得する
   * @param nodeId: 選択したNodeId
   */
  getNodeInfo(nodeId:any):Promise<any[]>{
    //APIからtree情報を取得する
    return this.http.get(this.treeListUrl)
    .toPromise()
    .then(response => response.json().data as any[])
    .catch(this.handleError);
  };
  
 /**
  *最新tree情報を取得する 
 */
  getTreeInfo():Promise<any[]>{
    var urlArr = window.location.href.split('/');
    const url = urlArr[0]+"//"+urlArr[2]+"/api/tree/0";
    //APIからtree情報を取得する
    return this.http.get(url)
    .toPromise()
    .then(response => response.json() as any[])
    .catch(this.handleError);
  };
  /**
   * 選択したNodeをAPIへ設定する
   * @param treeModel 選択したTree情報
   * @param nodeUrl 選択したURL
   */
　setNodeInfo(treeModel:TreeModel):Promise<void>{
    return this.http
    .put(this.treeListUrl, JSON.stringify(treeModel))
    .toPromise()
    .then(() => null)
    .catch(this.handleError);
  }
  /**
   *最新Tree情報をApiへ設定する
   */
  setTreeInfo(treeModel:TreeModel):Promise<void>{
    return this.http
    .put(this.treeListUrl, JSON.stringify(treeModel))
    .toPromise()
    .then(() => null)
    .catch(this.handleError);
  }
  /**
   * インデックスに選択したnode情報を送る
   */
  setCheckedNode(url:string,jsonStr:any):Promise<void>{
    return this.http
    .put(url,jsonStr,this.options)
    .toPromise()
    .then(response => response.json() as any)
    .catch(this.handleError);
  }
  /**
   * アイテム詳細に選定したリストを取得
   */

   getItemsNode():Promise<any>{
    var urlArr = window.location.href.split('/');
    const url = urlArr[0]+"//"+urlArr[2]+"/api/records/"+urlArr[urlArr.length-1];
    // const url = urlArr[0]+"//"+urlArr[2]+"/api/records/1";
    return this.http
    .get(url)
    .toPromise()
    .then(response => response.json() as any)
    .catch(this.handleError);
   }
   /**
   * 多言語対応
  */
  getLnagJson(url: any): Promise<any> {
    return this.http
    .get(url)
    .toPromise()
    .then(response => response.json() as any)
    .catch(this.handleError);
   }

  /**
   * エラー処理
   */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // 
    return Promise.reject(error.message || error);
  }

}
