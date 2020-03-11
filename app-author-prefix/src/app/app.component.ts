import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
declare var $: any;

@Component({
  selector: 'app-prefix-search',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
  }
  ngAfterViewInit() {
    this.getAuthorsPrefixSettings();
    this.getControlledVocabularies();
  }
  /**
   * edit authors prefix settings
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
   * update authors prefix settings
   */
  update(index: any) {
    console.log(this.displayData[index]);
    let data = { id: -1, name: "", url: "", scheme: "" };
    data.id = this.displayData[index].id;
    data.name = this.displayData[index].name_temp;
    data.url = this.displayData[index].url_temp;
    data.scheme = this.displayData[index].scheme_temp != this.controlledVocabularies[this.otherIndex] ?
      this.displayData[index].scheme_temp : this.displayData[index].otherScheme_temp;
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
   * delete authors prefix settings
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
   * add authors prefix settings
   */
  add() {
    this.new_settings.scheme = this.selectedScheme != this.controlledVocabularies[this.otherIndex] ? this.selectedScheme : this.schemeOtherValue;
    console.log(this.new_settings);
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
   * get authors prefix settings
   */
  getAuthorsPrefixSettings() {
    this.getDataOfAuthorsPrefixSettings().then(
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
  getControlledVocabularies() {
    this.getListOfControlledVocabularies().then(
      res => {
        this.controlledVocabularies = res.list;
        this.otherIndex = res.index;
        console.log(res);
      }
    ).catch();
  }
  /**
   * call web api (get author prefix settings)
   */
  getDataOfAuthorsPrefixSettings() {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/search_prefix";
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  /**
   * call web api (get list of controlled vocabularies)
   */
  getListOfControlledVocabularies() {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/list_controlledvocabularies";
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  /**
   * call web api (update author prefix settings)
   */
  updateSettings(data: any) {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/edit_prefix";
    return this.http
      .post(url, data)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  /**
   * call web api (delete author prefix settings)
   */
  deleteSettings(id: any) {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/delete_prefix/" + id;
    return this.http
      .delete(url)
      .toPromise()
      .then(response => response.json() as any)
      .catch(this.handleError);
  }
  /**
   * call web api (add an author prefix settings)
   */
  putSettings(data: any) {
    var urlArr = window.location.href.split('/');
    const url = urlArr[0] + "//" + urlArr[2] + "/api/authors/add_prefix";
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
    if (data.scheme.trim().length > 20) {
      return '"Scheme" is longer than 20 characters';
    }
    if (this.displayData.find(i => i.scheme == data.scheme && i.id != data.id)) {
      return '"Scheme" must be unique';
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