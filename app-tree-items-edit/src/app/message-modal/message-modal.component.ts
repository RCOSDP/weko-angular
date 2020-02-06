import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeList2Service } from '../tree-list2.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css']
})
export class MessageModalComponent implements OnInit {
  //
  @Output() buttonClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalAberto: any;
  @Input() redirectFlag: any;  

  ngOnInit() {
    this.setI18n();
  }
  public langJsonM = {
    Cancel: []
  };
  constructor(private treeList2Service: TreeList2Service) {
  }
  ngAfterViewInit(): void {
    this.modalAberto.status = "none";
    this.redirectFlag.flag=="F";
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
      this.langJsonM = res;
    }).catch(

    );
  }
  closeModal() {
    this.modalAberto.status = "none";
    let activity_id_text = document.getElementById('activity_id_text').innerText;
    if (activity_id_text!="" && this.redirectFlag.flag=="T") {
      let urlArr = window.location.href.split('/');
      window.location.href = urlArr[0] + "/workflow/activity/detail/" + activity_id_text;
    }
  }
  /**
   * キャンセルボタン
   */
  delCancle(){
    this.buttonClickEvent.emit("delCancle");
    //modal close
    this.closeModal();
  }
}
