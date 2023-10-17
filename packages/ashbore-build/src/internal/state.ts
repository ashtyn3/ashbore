import "reflect-metadata";

const stateKey = Symbol("state");

export function state(_: any, __: any): any {}
export type Binding<T> = T | undefined;
export function binding(_: any, __: any): any {}
export function STATE(target: View, name: string, init: any) {
  let value: any = init;
  Object.defineProperty(target, name, {
    set: (val) => {
      if (val != undefined) {
        if (val != value) {
          value = val;
          target.hydrate();
          if (target._schedule[name]) {
            target._schedule[name].holders.forEach((e) => {
              console.log(val);
              (e.el as any)[e.intern] = val;
              e.el.hydrate();
            });
          }
        }
      }
    },
    get: () => {
      return value;
    },
  });
}
// export function state(target: any, key: string) {
//     let value: any;
// }

export function view(constructor: any, _: any): any {
  // Reflect.defineMetadata(stateKey, [0], ctx, "main");
  // constructor.prototype.parent = document.body;
  return class extends constructor {
    parent = document.body;
  };
}

export class View {
  lastMount: any;
  parent: any;
  _schedule: { [key: string]: { holders: { el: View; intern: string }[] } };

  constructor(parent: any) {
    this._schedule = {};
    if (parent) {
      this.parent = parent;
    } else {
      this.parent = document.body;
    }
  }

  body() {}
  hydrate() {
    if (this.lastMount) {
      let b = this.body();
      this.lastMount.replaceWith(b);
      this.lastMount = b;
    }
  }

  schedule(name: string, internal: string, el: View) {
    let instance = { intern: internal, el: el };
    if (this._schedule[name]) {
      if (!this._schedule[name].holders.includes(instance)) {
        this._schedule[name].holders.push(instance);
      } else {
        let index = this._schedule[name].holders.indexOf(instance);
        this._schedule[name].holders = this._schedule[name].holders.splice(
          index,
          1
        );
        this._schedule[name].holders.push(instance);
      }
    } else {
      const sched = { holders: [instance] };
      this._schedule[name] = sched;
    }
  }
}
export function render(parent: any, el: View) {
  // console.log("last:",this,this.parent)
  // this.lastMount = this.parent.appendChild(this.body())
  if (parent?.contains(el.lastMount)) {
    el.lastMount = el.lastMount.replaceWith(el.body());
  } else {
    let b = el.body();
    if (!el.parent.contains(el.lastMount)) {
      el.lastMount = el.parent.appendChild(b);
    }
  }

  return el;
}

export function CORender(el: View) {
  el.lastMount = el.body();

  return el.lastMount;
}
