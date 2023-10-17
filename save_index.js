// @bun
var __legacyDecorateClassTS = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1;i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

// src/index.tsx
import $ from "/dist/index.js";
import {state as state2, Element, view} from "./packages/ashbore-build/dist/state.js";
class Hi extends  {
  constructor(parent) {
    super(parent);
    this.title = "A page";
  }
  body() {
    var _this = this;
    return function() {
      let e_H3rk0 = $.el("h1");
      const e_g0MZi = () => {
        _this.title = "Clicked page";
      };
      $.listen(e_H3rk0, "click", e_g0MZi);
      const e_YKbPj = _this.title;
      $.append(e_H3rk0, e_YKbPj);
      return e_H3rk0;
    }();
  }
}
__legacyDecorateClassTS([
  state2
], Hi.prototype, "title", undefined);

class App extends Element {
  hi;
  constructor(parent) {
    super(parent);
    this.name = "ashtyn";
    this.count = 0;
    this.anchor = $.el("div")
    this.hi = new Hi(this.anchor);

  }
  body() {
    var _this2 = this;
    return function() {
      // let _this2.anchor = $.el("div");
      // e.hi.parent = e.lastMount
      $.render(_this2.anchor, _this2.hi)
      // $.append(e_JRvo0, _this2.hi.body())
      
      // _this2.hi.parent = _this2.lastMount
      // _this2.hi.render()
      let e_tsCoM = $.el("p");
      let e_wENps = $.el("em");
      const e_MY8JB = _this2.count;
      $.append(e_wENps, e_MY8JB);
      $.append(e_tsCoM, e_wENps);
      $.append(_this2.anchor, e_tsCoM);
      let e_xXPs8 = $.el("button");
      $.append(e_xXPs8, "+");
      const e_T92pA = () => {
        _this2.count += 1;
      };
      $.listen(e_xXPs8, "click", e_T92pA);
      $.append(_this2.anchor, e_xXPs8);
      let e_GEKba = $.el("button");
      $.append(e_GEKba, "-");
      const e_C7sOS = () => {
        _this2.count -= 1;
      };
      $.listen(e_GEKba, "click", e_C7sOS);
      $.append(_this2.anchor, e_GEKba);
      return _this2.anchor;
    }();
  }
}
__legacyDecorateClassTS([
  state2
], App.prototype, "name", undefined);
__legacyDecorateClassTS([
  state2
], App.prototype, "count", undefined);
App = __legacyDecorateClassTS([
  view()
], App);
var e = new App();
$.render(document.body, e)