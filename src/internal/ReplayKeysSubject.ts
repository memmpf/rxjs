// @Author Miika Kulmala

import { Subject } from './Subject';
import { Subscriber } from './Subscriber';
import { Subscription } from './Subscription';

export class ReplayKeysSubject<T> extends Subject<T> {
  private _keyBuffer = new Map<string, T>();

  constructor() {
    super();
  }

  nextWithKey(key: string, value: T) {
    this._keyBuffer.set(key, value);
    super.next(value);
  }

  protected _subscribe(subscriber: Subscriber<T>): Subscription {
    this._throwIfClosed();

    const subscription = this._innerSubscribe(subscriber);

    const { _keyBuffer } = this;

    _keyBuffer.forEach((value) => {
      // Clone the value if it's an object to prevent external mutation
      this.next(typeof value === 'object' && value !== null ? { ...value } : value);
    });

    this._checkFinalizedStatuses(subscriber);

    return subscription;
  }
}
