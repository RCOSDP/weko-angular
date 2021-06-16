import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { TreeList2Service } from '../tree-list2.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-cofirm-modal',
  templateUrl: './cofirm-modal.component.html',
  styleUrls: ['./cofirm-modal.component.css']
})
export class CofirmModalComponent implements OnInit {
  //
  @Output() buttonClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalAberto: any;
  @Input() parentIsRoot = false;
  public langJsonM = {
    Choose_Processing: [],
    Delete_all: [],
    Move_items_to_parent_Index: [],
    Cancel: []
  };
  constructor(private treeList2Service: TreeList2Service) {
  }

  ngOnInit() {
    this.setI18n();
  }
  ngAfterViewInit(): void {
    this.modalAberto.status = 'none';
  }
  /**
   * i18n
   */
  setI18n() {
    const lang = $('#lang-code').val();
    const js = document.scripts;
    const jsUrl = js[js.length - 1].src;
    const strUrl = jsUrl.substring(0, jsUrl.lastIndexOf('static'));
    const jsonUrl = strUrl + 'static/json/weko_index_tree/translations/' + lang + '/messages.json';
    this.treeList2Service.getLnagJson(jsonUrl).then(res => {
      this.langJsonM = res;
    }).catch(

    );
  }

  closeModal() {
    this.modalAberto.status = 'none';
  }
  /**
   * キャンセルボタン
   */
  delCancle() {
    this.buttonClickEvent.emit('delCancle');
    // modal close
    this.closeModal();
  }
  /**
   * すべて削除
   */
  delAll() {
    this.buttonClickEvent.emit('delAll');
    this.closeModal();
  }
  /**
   *
   */
  delAndMove() {
    this.buttonClickEvent.emit('delAndMove');
    this.closeModal();
  }

}
