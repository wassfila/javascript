# javascript
Projects in this repository consist of helpers for :
- Networking
- GUI
- Custom Hardware Interfacing

Applications are based upon libraries:
- [nodejs](https://nodejs.org/en/)
node is the base for the server and uses the same json format to exchange with the clients, quick, nice and easy.
- [pixijs](http://www.pixijs.com/)
the webGL framework is the perfect tool for accelerated drawing (can include shaders), targeting 2d makes it easier.
- [paperjs](http://paperjs.org/)
here comes the vector graphics, pixels independence, efficient for any geometrical drawing, complementary with the pixi sprites drawing.
- [d3js](https://d3js.org/)
the vector graphics here go linked to data arrays, the smart thing is that the svg objects once created by d3 are independent from it, and can be used for any DOM mouse events.

#Demos
These demos are instanciations from the subdirectories of this repository, it is possible to reproduce the same by copying the content under a webserver's www directory.
##D3js
- [d3js multi touch drag example](http://homesmartmesh.com/d3/dragmulti/)
- [d3js graph parsed from json held in graph class](http://homesmartmesh.com/d3/graph/)
