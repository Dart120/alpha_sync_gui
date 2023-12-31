/* eslint-disable no-plusplus */
export default class Queue<T> {
  private elements: Record<number, T> = {};

  private head = 0;

  private tail = 0;

  public enqueue(element: T): void {
    this.elements[this.tail] = element;
    this.tail++;
  }

  public dequeue(): T {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;

    return item;
  }

  public peek(): T {
    return this.elements[this.head];
  }

  public get length(): number {
    return this.tail - this.head;
  }

  public get isEmpty(): boolean {
    return this.length === 0;
  }
}
