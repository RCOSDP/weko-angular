import { Component, NgZone, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
declare var $: any;

@Component({
  selector: 'app-author-search',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //i18n
  public langJson = {
    Author_Name: [],
    Author_Search: [],
    Author_Add_Author: [],
    Author_Mail_Address: [],
    Author_Search_No_Result: [],
    Author_Page_Previous: [],
    Author_Page_Next: [],
    Author_On_1_Page: [],
    Author_Import:[]
  };
  //画面データを設定
  public authorJsonObj: any = {
    authorNameInfo: [
      {
        familyName: "",
        firstName: "",
        fullName: "",
        language: "ja_kana",
        nameFormat: "familyNmAndNm",
        nameShowFlg: "true"
      },
    ],
    anthorIdInfo: [
      {
        idType: "1",
        anthorId: "",
        authorIdShowFlg: "true"
      }
    ],
    emailInfo: [
      { email: "" }
    ],
    affiliationInfo: [
      {
        identifierInfo: [
          {
            affiliationIdType: "1",
            affiliationId: "",
            identifierShowFlg: "true"
          }
        ],
        affiliationNameInfo: [
          {
            affiliationName: "",
            affiliationNameLang: "ja",
            affiliationNameShowFlg: "true"
          }
        ]
      }
    ]
  }
  //検索すると、サービスから戻ったデータ
  public searchJson: any = {
    hits: {
      total: 53,
      hits: [
        { _source: this.authorJsonObj }
      ]
    }
  };
  //検索条件
  public searchKey: string = "";
  //画面表示データを設定する
  public subDisplayData: any = {
  };
  //画面表示用
  public displayData: any = [];
  //1ヘージに表示数
  public numberOfpage: number = 25;
  //検索データ総数
  public total: number = 0;
  //ページに表示する件数from
  public numberFrom: number = 0;
  //ページに表示する件数To
  public numberTo: number = 0;
  //選択したヘージ数
  public pageNumber: number = 1;
  //page用リスト
  public pageList: number[] = [1];
  //検索結果0件
  public searchZero:boolean=false;
  //ソート氏名フラグ　asc→desc
  public sortNameFlg:string="noSort"
  //ソートメールフラグ　asc→desc
  public sortEmailFlg:string="noSort"
  //ソートキー
  public sortKey:string="";
  //ソート順
  public sortOrder:string="";
  public showFlg:number = 0;

  public cntOfpage:number = 25;


  constructor(private http: Http, private ngZone: NgZone) { }

  ngOnInit() {
    this.setI18n();
    window.appAuthorSearch = window.appAuthorSearch || {};
    window.appAuthorSearch.namespace = window.appAuthorSearch.namespace || {};
    window.appAuthorSearch.namespace.resetSearchData = this.resetSearchData.bind(this);
    window.appAuthorSearch.namespace.isCloseAuthorModal = this.isCloseAuthorModal.bind(this);
  }
  /**
   * i18n
   */
  setI18n() {
    let lang = $("#lang-code",parent.document).val();
    let js = document.scripts;
    let jsUrl = js[js.length - 1].src;
    let strUrl = jsUrl.substring(0, jsUrl.lastIndexOf('static'));
    let jsonUrl = strUrl + "static/json/weko_items_ui/translations/" + lang + "/messages.json";
    this.getLnagJson(jsonUrl).then(res => {
      this.langJson = res;
    }).catch(

    );
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
   * 検索処理
   */
  searchButton() {
    this.search(1);
  }
  /**
   * ソート処理
   */
  clickSort(val1:string,val2:string){
    //
    if(val2=="name"){
      this.sortNameFlg = val1;
      this.sortEmailFlg ="noSort";
      this.sortKey="authorNameInfo.fullName";
      this.sortOrder=val1;
    }else if(val2=="email"){
      this.sortNameFlg ="noSort";
      this.sortEmailFlg = val1;
      this.sortKey="emailInfo.email";
      this.sortOrder=val1;
    }
    //1page
    this.pageNumber = 1;
    this.search(1);
  }
  /**
   * 検索処理
   */
  search(pageNo:number) {
    //検索条件を設定する
    this.pageNumber = pageNo;
    let jsonObj = { searchKey: "", pageNumber: 1, numOfPage: 25 ,sortKey:"",sortOrder:""};
    this.searchKey = this.searchKey.replace("　", " ");
    jsonObj.searchKey = this.searchKey;
    jsonObj.pageNumber = this.pageNumber;
    jsonObj.numOfPage = this.numberOfpage;
    jsonObj.sortKey = this.sortKey;
    jsonObj.sortOrder = this.sortOrder;
    //サービスを呼び出す
    this.getPageDataJson(jsonObj).then(res => {
      this.searchJson = res;
      this.setDisplayData();
      //総数を設定する
      this.total = this.searchJson.hits.total.value;
      if(this.total == 0){
        this.searchZero = true;
        this.numberFrom = 0;
        this.numberTo = 0;
      }else{
        this.searchZero = false;
      }
      this.setPageInfo();
      //検索ボタンをクリックすると1ページを表示する
      this.setNumberOfPageInfo(pageNo);
    }).catch(res => {
      alert("Sorry, an unknown error has occurred!");
    }
      );
    //表示データを設定す
  }
  /**
   * 入力処理
   */
  input(index:number) {
    $("#input_button_"+index).prop('disabled', true);
    //todo
    // let author_info = this.displayData[index]
    // let author_info = this.searchJson.hits.hits[index]._source;
    let infoId = this.searchJson.hits.hits[index]._id;
    this.getjpcoarJson(infoId).then(res=>{
      var atext =JSON.stringify(res);
      $("#weko_id").text(infoId);
      $("#author_info").text(atext);
      $("#btn_setAuthorInfo").click();
      $("#btnModalClose").click();
      }).catch(res =>{
        $("#btnModalClose").click();
      })
  }
  /**
   * ページ数設定
   */
  setPageInfo() {
    this.pageList = [];
    let totalPageNo = Math.max(1, Math.ceil(this.total / this.numberOfpage));
    let generatePageList = function (totalPageNo, displayPageNo, curPage) {
      curPage -= 1;  // First page must be 0 (for calculations)
      displayPageNo = Math.min(displayPageNo, totalPageNo);
      let pageList = [];
      let margin = Math.floor(displayPageNo / 2);
      let minPage = curPage - margin;
      let maxPage = curPage + margin;
      if (minPage < 0) {
        maxPage -= minPage;
        minPage = 0;
      }
      if (maxPage >= totalPageNo) {
        minPage -= maxPage - totalPageNo + 1;
        if (minPage < 0) {
          minPage = 0;
        }
        maxPage = totalPageNo - 1;
      }
      for (let i = minPage; i <= maxPage; i++) {
        pageList.push(i + 1);
      }
      return pageList;
    };
    this.pageList = generatePageList(totalPageNo, 9, this.pageNumber);
  }
  /**
   * 表示件数情報を設定
   * @param val 選択したページ情報
   */
  setNumberOfPageInfo(val: number) {
    //初期化
    this.numberFrom = 0;
    this.numberTo = 0;
    //件数情報を設定
    this.numberFrom = (val - 1) * this.numberOfpage + 1;
    this.numberTo = val * this.numberOfpage;
    if (this.numberTo > this.total) {
      this.numberTo = this.total;
    }
  }
  /**
   * 1ページに表示件数を設定する
   */
  setNumber(val: number) {
    //1ページに表示件数を設定する
    this.numberOfpage = val;
    //1
    this.pageNumber = 1;
    //検索する
    this.search(1);
  }
  /**
   *ページをクリック
   */
  clickPage(index: number) {
    let totalPageNo = Math.floor(this.total / this.numberOfpage);
    //ページリンクの選択状態を設定する
    this.pageNumber = Math.max(1, Math.min(totalPageNo, index));
    //検索する
    this.search(index);
  }
  /**
   * 画面で表示するデータを設定する
   */
  setDisplayData() {
    this.subDisplayData = {};
    this.displayData = [];
    if (this.searchJson.hits.hits.length != 0) {
      for (let data of this.searchJson.hits.hits) {
        let subData = {
          authorNameInfo: { authorName: "" },
          anthorIdInfo: { authorId: "" },
          emailInfo: { email: "" },
        };
        if (data._source.hasOwnProperty("authorNameInfo")) {
          let nameInfo = "";
          for (let d of data._source.authorNameInfo) {
            if (d.nameFormat == "familyNmAndNm") {
              const name = [d.familyName,  d.firstName].join(' ').trim();
              nameInfo = nameInfo + name + "<br>";
            } else {
              nameInfo = nameInfo + d.fullName + "<br>";
            }
          }
          subData.authorNameInfo.authorName = nameInfo;
        }
        if (data._source.hasOwnProperty("anthorIdInfo")) {
          let idInfo = "";
          for (let d of data._source.anthorIdInfo) {
            idInfo = idInfo + d.authorId + "<br>";
          }
          subData.anthorIdInfo.authorId = idInfo;
        }
        if (data._source.hasOwnProperty("emailInfo")) {
          let emailInfo = "";
          for (let d of data._source.emailInfo) {
            emailInfo = emailInfo + d.email + "<br>";
          }
          subData.emailInfo.email = emailInfo;
        }
        this.displayData.push(subData);
      }
    }
  }

  /**
   * 検索処理
   */
  getPageDataJson(searchJsonObj: any): Promise<void> {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/search"
    return this.http
      .post(url, searchJsonObj)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }

  /**
   * 入力処理にJPCOAR化
   */
  getjpcoarJson(hitId: any): Promise<void> {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/input"
    var jsonObj = {"id":hitId}
    return this.http
      .post(url, jsonObj)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
// add sta
  showAddAuthor(){
    this.showFlg = 1;
  }
// add end
showFlga(){
  this.showFlg = 0
}

  /**
   * エラー処理
   */
  private handleError(error: any): Promise<any> {
    console.error('Sorry, an unknown error has occurred!', error); //
    return Promise.reject(error.message || error);
  }

  /**
   * Clear data on 'Import Author' modal when show modal.
   * Controls: key search, result search, display number.
   */
  resetSearchData(){
    this.ngZone.run(() => {
      this.displayData = [];
      this.searchKey = "";
      this.cntOfpage = 25;
      this.pageNumber = 1;
      this.searchZero = false;
      this.showFlga();
    });
  }

  /**
   * 1. Press 'Close' button on 'Add Author' modal
   *    => Close 'Add Author' modal and show 'Import Author' modal .
   * 2. Press 'Close' button on 'Import Author' modal
   *    => Close 'Import Author' modal.
   */
  isCloseAuthorModal(){
    this.ngZone.run(() => {
      if (this.showFlg == 1) {
        this.showFlga();
      } else {
        $('#app-author-search').modal('toggle');
      }
    });
  }

}
