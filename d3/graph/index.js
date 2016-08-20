
var w = window.innerWidth - 10,
    h = window.innerHeight - 10;

var indexToVetPos = function (i) {
    return (h * 0.1 + (h * 0.8) * (i) / 7);
}

//This is the accessor function we talked about above
var lineFunction = d3.svg.line()
                         .x(function (d) { return d.x; })
                         .y(function (d) { return d.y; })
                         .interpolate("linear");//linear,cardinal,monotone
var lineEdge = d3.svg.line()
                         .x(function (d) { return d.x; })
                         .y(function (d) { return d.y; })
                         .interpolate("linear");
var CurrentMoved = null;
var CurrentMovedId = null;



class Graph {
    updateEdgesCoord() {//needed after update Nodes coord, use here edge nodes ids
        for (var i = 0; i < this.Edges.length; i++) {
            var startNode = this.Edges[i].start;
            var endNode = this.Edges[i].end;
            this.Edges[i].path[0].x = this.Nodes[startNode].x;
            this.Edges[i].path[0].y = this.Nodes[startNode].y;
            this.Edges[i].path[1].x = this.Nodes[endNode].x;
            this.Edges[i].path[1].y = this.Nodes[endNode].y;
        }
    }
    updateEdges(svgo) {
        svgo.selectAll("path").data(this.Edges)
                .attr("d", function (d) { return lineFunction(d.path) })
                .attr("stroke", "blue")
                .attr("stroke-width", 2)
                .attr("fill", "none");
    }
    updateNode(index, x, y) {
        this.Nodes[index].x = x;
        this.Nodes[index].y = y;
        this.updateEdgesCoord();
    }
    constructor()//cannot call member functions on constructor
    {
        this.Nodes = [];
        this.Edges = [];
    }
    createSampleNodes() {
        for (var i = 0; i < 8; i++) {
            this.Nodes[i] = { id: i, x: 50 + i * i*10, y: indexToVetPos(i), r: 20, color: "white", Edges: [] };
        }
        this.Edges[0] = { start: 0, end: 1, path: [{ "x": 1, "y": 5 }, { "x": 20, "y": 20 }] };
        this.Edges[1] = { start: 3, end: 1, path: [{ "x": 1, "y": 5 }, { "x": 20, "y": 20 }] };
        this.Edges[2] = { start: 4, end: 1, path: [{ "x": 1, "y": 5 }, { "x": 20, "y": 20 }] };

        this.updateEdgesCoord();
    }
}

var graph = new Graph();

//graph.createSampleNodes();

document.onmousemove = function (e) {
    if (CurrentMoved != null) {
        CurrentMoved.attr("transform", "translate(" + e.pageX + "," + e.pageY + ")");
        if (graph.Nodes) {
            graph.updateNode(CurrentMovedId, e.pageX, e.pageY);
        }
        if (graph.Edges) {
            graph.updateEdgesCoord();
            graph.updateEdges(svgo);
            //update the path
            svgo.selectAll("path").data(graph.Edges)
                    .attr("d", function (d) { return lineFunction(d.path) })
                    .attr("stroke", "blue")
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
        }
    }
}

document.ontouchmove = function (ev) {
    if (CurrentMoved != null)
    {
        if (ev.touches.length > 0)
        {
            CurrentMoved.attr("transform", "translate(" + ev.touches[0].pageX + "," + ev.touches[0].pageY + ")");
        }
    }
}

document.ontouchstart = function (ev) {
    if (CurrentMoved != null) {
        if (ev.touches.length > 0) {
            console.log("Document Touch start");
        }
    }
}

d3.select("body").style("background-color", "white");
	
var svgo = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)
	.append("g")
    .attr("transform", "translate(5,5)");



var MyMouseUp = function () {
    var g = d3.select(this);
    g.select("circle").style("fill", "blue");
    CurrentMoved = null;
    CurrentMovedId = null;
}

var MyMouseDown = function () {
    var g = d3.select(this);
    var c = g.select("circle");
    c.style("fill", "black");
    CurrentMoved = g;
    CurrentMovedId = g.datum().id;
}
var MyTouchDown = function () {
    var g = d3.select(this);
    var c = g.select("circle");
        c.style("fill", "green");
        if (CurrentMoved == null)//otherwise do not override
        {
            CurrentMoved = g;
            CurrentMovedId = g.datum().id;
        }
}

d3.json("graph.json", function (error, loadedGraph) {
    if (error) throw error;
    console.log(loadedGraph);
    graph.Nodes = loadedGraph.Nodes;
    graph.Edges = loadedGraph.Edges;
    graph.updateEdgesCoord();
    graph.updateEdges(svgo);
    //update the path
    var r = h / 30;
    if (r < 5) r = 5;
    if (r > 30) r = 30;

    svgo.append("g").selectAll("path").data(graph.Edges).enter().append("path")
            .attr("d", function (d) { return lineFunction(d.path) })
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none");


    svgo.append("g").selectAll("circle").data(graph.Nodes).enter().append("circle")
            .on("mousedown", MyMouseDown)
            .on("touchstart", MyTouchDown)
            .on("mouseup", MyMouseUp)
            .on("touchend", MyMouseUp)
            .attr("r", r)
            .style("fill", "purple")
            .style("stroke", "#000")
            .style("stroke-width", "2px")
            .attr("onmouseover", "evt.target.setAttribute('opacity', '0.5');")
            .attr("onmouseout", "evt.target.setAttribute('opacity', '1');")
    //.attr("onmousedown", function (d, i) { return MyMouseDown(d,i) })
    ;
    svgo.selectAll("circle")
        //.transition().duration(500)
        .attr("transform", function (d, i) { return "translate(" + d.x + "," + d.y + ")"; })
    ;
});




