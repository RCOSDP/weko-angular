import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
declare var $: any;

@Component({
  selector: 'app-affiliation-search',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //画面データを設定
  //i18n
  public langJson = {
    Affiliation_Name: [],
    Affiliation_Scheme: [],
    Affiliation_URL: [],
    Author_Control: [],
    Author_Button_Edit: [],
    Author_Button_Save: [],
    Author_Button_Cancel: [],
    Author_Button_Delete: [],
    Author_Select: [],
    Author_Button_Add: []
  };
  
  public control = {
    edit_flag: []
  };
  public displayData: [
    {
      id: -1,
      name: "",
      url: "",
      scheme: "",
      name_temp: "",
      url_temp: "",
      scheme_temp: "",
      otherScheme_temp: "",
    }
  ];
  public new_settings: any = {
    name: "",
    url: "",
    scheme: ""
  };
  public controlledVocabularies = [];
  public otherIndex: number = 0;
  public schemeOtherValue: string = "";
  public selectedScheme: string = "";

  constructor(private http: Http, ) { }

  ngOnInit() {
    this.setI18n();
  }
  ngAfterViewInit() {
    this.getAuthorsAffiliationSettings();
    this.getAffiliationScheme();
  }

  /**
   * i18n
   */
  setI18n() {
    let lang = $("#lang-code").val();
    let js = document.scripts;
    let jsUrl = js[js.length - 1].src;
    let strUrl = jsUrl.substring(0, jsUrl.lastIndexOf('static'));
    let jsonUrl = strUrl + "static/json/weko_authors/translations/" + lang + "/messages.json";
    console.log(lang);
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
   * edit authors affiliation settings
   */
  edit(index: any) {
    this.control.edit_flag[index] = true
    console.log(this.displayData[index]);
    this.displayData[index].name_temp = this.displayData[index].name;
    this.displayData[index].url_temp = this.displayData[index].url;
    if (this.controlledVocabularies.indexOf(this.displayData[index].scheme) < 0) {
      this.displayData[index].scheme_temp = this.controlledVocabularies[this.otherIndex];
      this.displayData[index].otherScheme_temp = this.displayData[index].scheme;
    } else {
      this.displayData[index].scheme_temp = this.displayData[index].scheme;
      this.displayData[index].otherScheme_temp = "";
    }
  }
  /**
   * update authors affiliation settings
   */
  update(index: any) {
    console.log(this.displayData[index]);
    let data = { id: -1, name: "", url: "", scheme: "" };
    data.id = this.displayData[index].id;
    data.name = this.displayData[index].name_temp;
    data.url = this.displayData[index].url_temp;
    data.scheme = this.displayData[index].scheme_temp != this.controlledVocabularies[this.otherIndex] ?
      this.displayData[index].scheme_temp.trim() : this.displayData[index].otherScheme_temp.trim();
    let validation_res = this.validation(data);
    if (validation_res != 'OK') {
      alert(validation_res);
      return;
    }
    this.updateSettings(data).then(
      res => {
        if (res.code == 400) {
          alert(res.msg);
        } else {
          alert('Update completed');
          window.location.reload();
        }
      }).catch(
        res => {
          alert(res.msg);
          window.location.reload();
        });
  }
  /**
   * delete authors affiliation settings
   */
  delete(id: any) {
    console.log(id);
    this.deleteSettings(id).then(
      res => {
        alert('Successfully deleted');
      }).catch(
        res => {
          alert(res.msg);
        });
    window.location.reload();
  }
  /**
   * add authors affiliation settings
   */
  add() {
    console.log(this.new_settings);
    this.new_settings.scheme = this.selectedScheme != this.controlledVocabularies[this.otherIndex] ?
      this.selectedScheme.trim() : this.schemeOtherValue.trim();
    let validation_res = this.validation(this.new_settings);
    if (validation_res != 'OK') {
      alert(validation_res);
      return;
    }
    this.putSettings(this.new_settings).then(
      res => {
        if (res.code == 400) {
          alert(res.msg);
        } else {
          alert('Successfully added');
          window.location.reload();
        }
      }).catch(
        res => {
          alert(res.msg);
          window.location.reload();
        });
  }
  /**
   * get authors affiliation settings
   */
  getAuthorsAffiliationSettings() {
    this.getDataOfAuthorsAffiliationSettings().then(
      res => {
        this.displayData = res;
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          this.control.edit_flag[i] = false;
          this.displayData[i].name_temp = this.displayData[i].name;
          this.displayData[i].url_temp = this.displayData[i].url;
          this.displayData[i].scheme_temp = this.displayData[i].scheme;
        }
      }
    ).catch();
  }
  /**
   * get list of controlled vocabularies
   */
  getAffiliationScheme() {
    this.getListOfAffiliationScheme().then(
      res => {
        this.controlledVocabularies = res.list;
        this.otherIndex = res.index;
        console.log(res);
      }
    ).catch();
  }
  /**
   * call web api (get author affiliation settings)
   */
  getDataOfAuthorsAffiliationSettings() {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/search_affiliation";
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  /**
   * call web api (get list of affiliation identifier scheme)
   */
  getListOfAffiliationScheme() {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/list_affiliation_scheme";
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  /**
   * call web api (update author affiliation settings)
   */
  updateSettings(data: any) {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/edit_affiliation";
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  /**
   * call web api (delete author affiliation settings)
   */
  deleteSettings(id: any) {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/delete_affiliation/" + id;
    return this.http
      .delete(url)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  /**
   * call web api (add an author affiliation settings)
   */
  putSettings(data: any) {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/add_affiliation";
    return this.http
      .put(url, data)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  /**
   * Check if "name" is empty and Verify URL
   */
  validation(data: any) {
    if (data.name.trim().length == 0) {
      return 'Please enter the correct "Name"';
    }
    if (data.scheme.trim().length == 0) {
      return 'Please enter the correct "Scheme"';
    }
    if (data.scheme.trim().length > 30) {
      return '"Scheme" is longer than 30 characters';
    }
    if (this.displayData.find(i => i.scheme == data.scheme && i.id != data.id)) {
      return 'Specified scheme is already exist.';
    }
    let reg = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
    if (data.url.length > 0 && !reg.test(data.url)) {
      return 'Please enter the correct "URL"';
    }
    return 'OK';
  }
  /**
   * エラー処理
   */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); //
    return Promise.reject(error.message || error);
  }
}


