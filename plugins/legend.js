Dygraph.Plugins.Legend = (function() {


// QUESTION: Are plugins singletons? Or does each dygraph get its own?
var legend = function() {
  this.legend_div_ = null;
};

legend.prototype.toString = function() {
  return "Legend Plugin";
};

legend.prototype.activate = function(g, r) {
  r.addEventListener('layout', legend.layout);
  r.addEventListener('select', legend.select);
  r.addEventListener('deselect', legend.deselect);
};

legend.layout = function(e) {
  var g = e.dygraph;
  var chart_area = e.chartRect();

  var divWidth = g.getOption('labelsDivWidth');
  var messagestyle = {
    "position": "absolute",
    "fontSize": "14px",
    "zIndex": 10,
    "width": divWidth + "px",
    "top": chart_area.y + "px",
    "left": (chart_area.x + chart_area.w - divWidth - 2) + "px",
    "background": "white",
    "textAlign": "left",
    "overflow": "hidden"};

  // QUESTION: are methods in dygraph-utils.js available for plugins to use?
  // QUESTION: can we take this opportunity to get rid of labelsDivStyles?
  Dygraph.update(messagestyle, g.getOption('labelsDivStyles'));
  var div = document.createElement("div");
  div.className = "dygraph-legend";
  for (var name in messagestyle) {
    if (messagestyle.hasOwnProperty(name)) {
      try {
        div.style[name] = messagestyle[name];
      } catch (e) {
        this.warn("You are using unsupported css properties for your browser in labelsDivStyles");
      }
    }
  }

  this.legend_div_ = div;
  // TODO(danvk): come up with a cleaner way to expose this.
  g.graphDiv.appendChild(div);
};

legend.select = function(e) {
  var xValue = e.selectedX;
  var points = e.selectedPoints;
  // A real plugin would include this code itself.
  var html = e.dygraph.generateLegendHTML_(xValue, points, 10);
  this.legend_div_.innerHTML = html;
};

legend.deselect = function(e) {
  var html = e.dygraph.generateLegendHTML_(undefined, undefined, 10);
  this.legend_div_.innerHTML = html;
};

legend.prototype.destroy = function() {
  this.legend_div_ = null;
};


return legend;
})();
