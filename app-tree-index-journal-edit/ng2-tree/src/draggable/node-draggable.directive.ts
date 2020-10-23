import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NodeDraggableService } from './node-draggable.service';
import { CapturedNode } from './captured-node';
import { Tree } from '../tree';

@Directive({
  selector: '[nodeDraggable]'
})
export class NodeDraggableDirective implements OnDestroy, OnInit {
  public static DATA_TRANSFER_STUB_DATA = 'some browsers enable drag-n-drop only when dataTransfer has data';

  @Input() public nodeDraggable: ElementRef;

  @Input() public tree: Tree;

  private nodeNativeElement: HTMLElement;
  private disposersForDragListeners: Function[] = [];

  public constructor(
    @Inject(ElementRef) public element: ElementRef,
    @Inject(NodeDraggableService) private nodeDraggableService: NodeDraggableService,
    @Inject(Renderer2) private renderer: Renderer2
  ) {
    this.nodeNativeElement = element.nativeElement;
  }

  public ngOnInit(): void {
    if (!this.tree.isStatic()) {
      this.renderer.setAttribute(this.nodeNativeElement, 'draggable', 'true');
      this.disposersForDragListeners.push(
        this.renderer.listen(this.nodeNativeElement, 'dragenter', this.handleDragEnter.bind(this))
      );
      this.disposersForDragListeners.push(
        this.renderer.listen(this.nodeNativeElement, 'dragover', this.handleDragOver.bind(this))
      );
      this.disposersForDragListeners.push(
        this.renderer.listen(this.nodeNativeElement, 'dragstart', this.handleDragStart.bind(this))
      );
      this.disposersForDragListeners.push(
        this.renderer.listen(this.nodeNativeElement, 'dragleave', this.handleDragLeave.bind(this))
      );
      this.disposersForDragListeners.push(
        this.renderer.listen(this.nodeNativeElement, 'drop', this.handleDrop.bind(this))
      );
      this.disposersForDragListeners.push(
        this.renderer.listen(this.nodeNativeElement, 'dragend', this.handleDragEnd.bind(this))
      );
    }
  }

  public ngOnDestroy(): void {
    /* tslint:disable:typedef */
    this.disposersForDragListeners.forEach(dispose => dispose());
    /* tslint:enable:typedef */
  }

  private handleDragStart(e: DragEvent): any {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    this.nodeDraggableService.captureNode(new CapturedNode(this.nodeDraggable, this.tree));

    e.dataTransfer.setData('text', NodeDraggableDirective.DATA_TRANSFER_STUB_DATA);
    e.dataTransfer.effectAllowed = 'move';
  }

  private handleDragOver(e: DragEvent): any {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  private handleDragEnter(e: DragEvent): any {
    e.preventDefault();
    console.log("Offset moved: X:" + e.offsetX + ", Y:" + e.offsetY);
    console.log("Offset target: " + this.nodeNativeElement.offsetWidth + ", " + this.nodeNativeElement.offsetHeight);
    console.log("Client target: " + this.nodeNativeElement.clientWidth + ", " + this.nodeNativeElement.clientHeight);

    if (this.containsElementAt(e)) {
      if (this.nodeDraggableService.getCapturedNode().element !== this.nodeDraggable) {
        // let pointX = e.pageX - this.nodeNativeElement.offsetLeft;
        if (e.offsetY < this.nodeNativeElement.offsetHeight / 2) {
          this.removeClass('over-drop-target');
          this.addClass('over-drop-target-sibling');
        } else {
          this.removeClass('over-drop-target-sibling');
          this.addClass('over-drop-target');
        }
      }
    }
  }

  private handleDragLeave(e: DragEvent): any {
    if (!this.containsElementAt(e)) {
      this.removeClass('over-drop-target');
      this.removeClass('over-drop-target-sibling');
    }
  }

  private handleDrop(e: DragEvent): any {
    e.preventDefault();
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    const isDropPossible = this.isDropPossible(e);

    this.removeClass('over-drop-target');
    this.removeClass('over-drop-target-sibling');

    if (!isDropPossible) {
      return false;
    }

    if (this.nodeDraggableService.getCapturedNode()) {
      const isMovedInto = e.offsetY >= this.nodeNativeElement.offsetHeight / 2;

      return this.notifyThatNodeWasDropped(isMovedInto);
    }
  }

  private isDropPossible(e: DragEvent): boolean {
    const capturedNode = this.nodeDraggableService.getCapturedNode();
    return capturedNode && capturedNode.canBeDroppedAt(this.nodeDraggable) && this.containsElementAt(e);
  }

  private handleDragEnd(e: DragEvent): any {
    this.removeClass('over-drop-target');
    this.nodeDraggableService.releaseCapturedNode();
  }

  private containsElementAt(e: DragEvent): boolean {
    const { x = e.clientX, y = e.clientY } = e;
    return this.nodeNativeElement.contains(document.elementFromPoint(x, y));
  }

  private addClass(className: string): void {
    const classList: DOMTokenList = this.nodeNativeElement.classList;
    classList.add(className);
  }

  private removeClass(className: string): void {
    const classList: DOMTokenList = this.nodeNativeElement.classList;
    classList.remove(className);
  }

  private notifyThatNodeWasDropped(isMovedInto = false): void {
    this.nodeDraggableService.fireNodeDragged(this.nodeDraggableService.getCapturedNode(), this.nodeDraggable, isMovedInto);
  }
}
