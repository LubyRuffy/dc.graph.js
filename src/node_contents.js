dc_graph.text_contents = function() {
    var _contents = {
        parent: property(null),
        update: function(container) {
            var text = container.selectAll('text.node-label')
                    .data(function(d) { return [d]; });
            text.enter().append('text')
                .attr('class', 'node-label');
            var tspan = text.selectAll('tspan').data(function(n) {
                var lines = _contents.parent().nodeLabel.eval(n);
                if(!lines)
                    return [];
                else if(typeof lines === 'string')
                    lines = [lines];
                var first = lines.length%2 ? 0.3 - (lines.length-1)/2 : 1-lines.length/2;
                return lines.map(function(line, i) { return {line: line, ofs: (i==0 ? first : 1) + 'em'}; });
            });
            tspan.enter().append('tspan')
                .attr('x', 0)
                .attr('dy', function(d) { return d.ofs; });
            tspan.text(function(d) { return d.line; });
            tspan.exit().remove();
            text
                .attr('fill', _contents.parent().nodeLabelFill.eval);
        },
        textbox: function(container) {
            return this.select(container).node().getBBox();
        },
        select: function(container) {
            return container.select('text.node-label');
        }
    };
    return _contents;
};

dc_graph.with_icon_contents = function(contents, width, height) {
    var _contents = {
        parent: property(null).react(function(parent) {
            contents.parent(parent);
        }),
        padding: function(d) {
            var padding = _contents.parent().nodeLabelPadding.eval(d);
            return {
                x: padding.x * 3,
                y: padding.y * 3
            };
        },
        update: function(container) {
            var g = container.selectAll('g.with-icon')
                    .data(function(d) { return [d]; });
            var gEnter = g.enter();
            gEnter.append('g')
                .attr('class', 'with-icon')
              .append('image').attr({
                class: 'icon',
                width: width + 'px',
                height: height + 'px'
            });
            g.call(contents.update);
            contents.select(g)
                .attr('transform',  'translate(' + width/2 + ')');
            g.selectAll('image.icon').attr({
                href: _contents.parent().nodeIcon.eval,
                x: function(d) {
                    var totwid = width + contents.textbox(d3.select(this.parentNode)).width;
                    return -totwid/2 - _contents.parent().nodeLabelPadding.eval(d).x;
                },
                y: -height/2
            });
        },
        textbox: function(container) {
            var box = contents.textbox(container);
            box.x += width/2;
            return box;
        },
        select: function(container) {
            return container.select('g.with-icon');
        }
    };
    return _contents;
};

