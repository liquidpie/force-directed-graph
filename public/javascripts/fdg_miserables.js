!(function(){
    "use strict";

    var width,height;
    var chartWidth, chartHeight;
    var margin;
    var svg = d3.select("#graph").append("svg");
    var chartLayer = svg.append("g").classed("chartLayer", true);

    main();

    function main() {
        setSize();
        drawChart();
    }

    function setSize() {
        width = document.querySelector("#graph").clientWidth;
        height = document.querySelector("#graph").clientHeight;

        margin = {top:0, left:0, bottom:0, right:0 };


        chartWidth = width - (margin.left+margin.right);
        chartHeight = height - (margin.top+margin.bottom);

        svg.attr("width", width).attr("height", height);

        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate("+[margin.left, margin.top]+")");

    }

    function drawChart() {

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id }))
            // .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2));

        var popup = $("#popup");

        d3.json("../json/miserables.json", function (err, data) {

            if (err) throw err;

            // add radius for nodes
            data.nodes.forEach(function (d) { d.r = d3.randomUniform(6, 8)(); });

            var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(data.links)
                .enter()
                .append("line")
                .attr("class", "link");

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(data.nodes)
                .enter().append("circle")
                .attr("r", function(d){  return d.r })
                .attr("fill", randColor)
                .attr("class", "node")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))
                .on("dblclick", clicked);

            var ticked = function() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            };

            var tooltip = function (d) {
              return d.id;
            };

            node.append("title")
                .text(function(d){ return tooltip(d); });

            simulation
                .nodes(data.nodes)
                .on("tick", ticked);

            simulation.force("link")
                .links(data.links);

        });

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        function clicked(d) {
            console.log('im clicked' + d.id);

            var character = function () {
                var data = null;
                $.ajax({
                    url : '/character',
                    method : 'GET',
                    data : {
                      id : d.id
                    },
                    async : false,
                    success : function (result) {
                        data = result;
                    },
                    error : function (xhr, ex) {
                        console.log("couldn't fetch result" + ex + xhr);
                    }
                });
                return data;
            };

            var out = character();

           popup.html('<p class="heading3">' + out.name + '</p><p>' + out.description + '</p>').show();
        }

        $(document).ready(function () {
            $(document).on('keydown', function (e) {
                if (e.keyCode === 27) { // ESC
                    popup.hide();
                }
            });

            $("#about").html(about());
        });

        function randColor() {
            var colors = ['#C0C0C0', '#808080', '#000000', '#FF0000', '#800000', '#808000',
                '#008000', '#008080', '#800080', '#F08080', '#FFA07A', '#8B7B8B',
                '#7B68EE', '#3D59AB', '#009ACD', '#66CDAA', '#838B83', '#C67171'];

            var randomIdx = function (max) {
                return Math.floor(Math.random() * (max + 1));
            };

            return colors[randomIdx(colors.length)];
        }

        function about() {
            return "This undirected network contains co-occurances of characters in Victor Hugo's novel <strong>Les Misérables</strong>. " +
                "A node represents a character and an edge between two nodes shows that these two characters appeared in the same chapter of the the book. " +
                "The weight of each link indicates how often such a co-appearance occured." +
                "<br/><br/>" +
                "It has following characteristics:" +
                "<ol>" +
                    "<li>1. There are 77 nodes and 254 edges</li>" +
                    "<li>2. Nodes can be pulled and pushed</li>" +
                    "<li>3. Description of character is shown when you double click on Node. Use ESC to hide description</li>" +
                "</ol>";
        }
    }
}());