import { Injectable } from '@angular/core';
import { TreeModel } from '../../ng2-tree/src/tree.types';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TreeList2Service {
  // サービスの設定
  private headers = new Headers({ 'Content-Type': 'application/json' });
  public options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  /**
   * 選択したNODEの情報を取得する
   * @param nodeId: 選択したNodeId
   */
  getNodeInfo(url: string): Promise<any> {
    // APIからtree情報を取得する
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  /**
   *最新tree情報を取得する
  */
  getTreeInfo(url: string): Promise<any[]> {
    // APIからtree情報を取得する
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as any[])
      .catch(this.handleError);
  }
  /**
   *最新Tree情報をApiへ設定する
   */
  setTreeInfo(parentNodeId: string, treeModel: any): Promise<any> {
    const urlArr = window.location.href.split('/');
    const url = urlArr[0] + '//' + urlArr[2] + '/api/tree/index/' + parentNodeId;
    return this.http
      .post(url, treeModel, this.options)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  /**
   * nodeの情報を設定する
   */
  setNodeInfo(nodeId: string, data: {}): Promise<any> {
    const urlArr = window.location.href.split('/');
    const url = urlArr[0] + '//' + urlArr[2] + '/api/tree/index/' + nodeId;
    return this.http
      .put(url, data)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  /**
   *
   *最新Tree情報をApiへ設定する
   *@param nodeId selected nodeId
   *@param action move , all
   */
  delOrMoveNodeInfo(nodeId: any, action: string): Promise<any> {
    const urlArr = window.location.href.split('/');
    const url = urlArr[0] + '//' + urlArr[2] + '/api/tree/index/' + nodeId + '?action=' + action;
    return this.http
      .delete(url)
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
   * node move
   */
  setNodeMoved(nodeId: any, infoJson: any): Promise<any> {
    const urlArr = window.location.href.split('/');
    const url = urlArr[0] + '//' + urlArr[2] + '/api/tree/move/' + nodeId;
    return this.http
     .put(url, infoJson)
     .toPromise()
     .then(response => response.json() as any)
     .catch(this.handleError);
  }


  upload(formData: FormData, nodeId): Promise<any> {
    const headers = new Headers();
    // headers.append('enctype', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = new RequestOptions({ headers: headers });
    const urlArr = window.location.href.split('/');
    const url = urlArr[0] + '//' + urlArr[2] + '/admin/indexedit/upload';
    return this.http
        .post(url, formData, options)
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
