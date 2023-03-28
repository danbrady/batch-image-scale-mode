figma.showUI(__html__);

figma.ui.resize(400, 128);

function clone(val: any): any {
  const type = typeof val;
  if (val === null) {
    return null;
  } else if (type === "undefined" || type === "number" || type === "string" || type === "boolean") {
    return val;
  } else if (type === "object") {
    if (val instanceof Array) {
      return val.map((x) => clone(x));
    } else if (val instanceof Uint8Array) {
      return new Uint8Array(val);
    } else {
      let o: any = {};
      for (const key in val) {
        o[key] = clone(val[key]);
      }
      return o;
    }
  }
  throw "unknown";
}

figma.ui.onmessage = (pluginMessage) => {
  const selection = figma.currentPage.selection;
  let appliedCount = 0;

  selection.map((node) => {
    if (node.type === "RECTANGLE") {
      const fills = clone(node.fills);
      fills.map((fill: any) => {
        fill.scaleMode = pluginMessage.scaleMode;
      });

      node.fills = fills;
      appliedCount++;
    }
  });

  figma.ui.postMessage({ appliedCount });
};
