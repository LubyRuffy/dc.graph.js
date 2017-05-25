/**
 * `dc_graph.graphviz_layout` is an adaptor for viz.js (graphviz) layouts in dc.graph.js
 *
 * In addition to the below layout attributes, `graphviz_layout` also implements the attributes from
 * {@link dc_graph.graphviz_attrs graphviz_attrs}
 * @class graphviz_layout
 * @memberof dc_graph
 * @param {String} [id=uuid()] - Unique identifier
 * @return {dc_graph.graphviz_layout}
 **/
dc_graph.graphviz_layout = function(id, layout) {
    var _layoutId = id || uuid();
    var _dispatch = d3.dispatch('tick', 'start', 'end');
    var _dotString;

    function init(options) {
    }

    function data(nodes, edges, constraints, options) {
        var lines = [];
        lines.push((layout === 'neato' ? 'graph' : 'digraph') + ' g {');
        lines = lines.concat(nodes.map(function(v) {
            return '  "' + v.dcg_nodeKey + '"';
        }));
        lines = lines.concat(edges.map(function(e) {
            return '  "' + e.dcg_edgeSource + '" -> "' + e.dcg_edgeTarget + '"';
        }));
        lines.push('}');
        lines.push('');
        _dotString = lines.join('\n');
    }

    function start(options) {
        var result = Viz(_dotString, {format: 'json', engine: layout});
        _dispatch.start();
        result = JSON.parse(result);
        var nodes = result.objects.map(function(n) {
            
            return {
                
            };
        });
        _dispatch.end(nodes, edges);
    }

    function stop() {
    }

    var graphviz = dc_graph.graphviz_attrs(), graphviz_keys = Object.keys(graphviz);
    return Object.assign(graphviz, {
        layoutAlgorithm: function() {
            return layout;
        },
        layoutId: function() {
            return _layoutId;
        },
        on: function(event, f) {
            _dispatch.on(event, f);
            return this;
        },
        init: function(options) {
            this.optionNames().forEach(function(option) {
                options[option] = options[option] || this[option]();
            }.bind(this));
            init(options);
            return this;
        },
        data: function(nodes, edges, constraints, options) {
            data(nodes, edges, constraints, options);
        },
        start: function(options) {
            start(options);
        },
        stop: function() {
            stop();
        },
        optionNames: function() {
            return graphviz_keys;
        },
        populateLayoutNode: function() {},
        populateLayoutEdge: function() {}
    });
}
