import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CapturedNode } from './captured-node';
import { NodeDraggableEvent } from './draggable.events';

@Injectable()
export class NodeDraggableService {
  public draggableNodeEvents$: Subject<NodeDraggableEvent> = new Subject<NodeDraggableEvent>();

  private capturedNode: CapturedNode;

  public fireNodeDragged(captured: CapturedNode, target: ElementRef, isMovedInto = false): void {
    if (!captured.tree || captured.tree.isStatic()) {
      return;
    }

    this.draggableNodeEvents$.next(new NodeDraggableEvent(captured, target, isMovedInto));
  }

  public captureNode(node: CapturedNode): void {
    this.capturedNode = node;
  }

  public getCapturedNode(): CapturedNode {
    return this.capturedNode;
  }

  public releaseCapturedNode(): void {
    this.capturedNode = null;
  }
}
