export function el(tag) {
  return document.createElement(tag);
}

export function attr(el, name, value) {
  el.setAttribute(name, value.toString());
}

export function listen(el, event, cb) {
  el.addEventListener(event, cb);
  // el.setAttribute(name, value.toString());
}

export function append(el, child) {
  switch (typeof child) {
    case "number": {
      el.appendChild(document.createTextNode(child.toString()));
      break;
    }
    case "string": {
      el.appendChild(document.createTextNode(child.toString()));
      break;
    }
    case "object": {
      el.appendChild(child);
      break;
    }
    default: {
      el.appendChild(child);
      break;
    }
  }
}
