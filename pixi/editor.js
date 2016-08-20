
var MyEditor;
var Background;
var RFNode;
var Noise;
var Obstacle;

var Nodes = [];
var Obstacles = [];
var Noises = [];


function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    var StartPosition = this.data.getLocalPosition(this.parent)
    this.StartPosition = StartPosition;

    if ((StartPosition.x > MyEditor.ObjectsPanel.x) &&
            (StartPosition.y > MyEditor.ObjectsPanel.y) &&
            (StartPosition.x < (MyEditor.ObjectsPanel.x + MyEditor.ObjectsPanel.width)) &&
            (StartPosition.y < (MyEditor.ObjectsPanel.y + MyEditor.ObjectsPanel.height)))
    {
        this.EditorIsDragged = true;
    }
    else {
        this.EditorIsDragged = false;
    }
    
}

function DragEndCommon(it)
{
    it.alpha = 1;

    it.dragging = false;

    var EndPosition = it.data.getLocalPosition(it.parent)
    if ((EndPosition.x > MyEditor.House.x) &&
            (EndPosition.y > MyEditor.House.y) &&
            (EndPosition.x < (MyEditor.House.x + MyEditor.House.width)) &&
            (EndPosition.y < (MyEditor.House.y + MyEditor.House.height))) 
    {
        if (it.EditorIsDragged) 
        {
            return true;
        }
        else 
        {
            console.log("Not the editor");
            return false;
        }
    }
    else
    {
        console.log("in Editor released");
        if (!it.EditorIsDragged)
        {
            //reset the position
            console.log("Not the editor, Resetting the position");
            it.x = it.StartPosition.x;
            it.y = it.StartPosition.y;
        }
        return false;
    }

}

function onDragRFEnd() {
    if (DragEndCommon(this))
    {
        createNode(RFNode.x, RFNode.y, "RFNode.png", false);
    }
    //this.data = null;
}

function onNoiseDragEnd() {
    if (DragEndCommon(this)) {
        createNoise(Noise.x, Noise.y, "Noise.png", false);
    }
    //this.data = null;
}

function onObstDragEnd() {
    if (DragEndCommon(this)) {
        createObstacle(Obstacle.x, Obstacle.y, "Obstacle.png",false);
    }
    //this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

function on_EditorRFNode_MouseDown() {
    RFNode.MouseDownFirst = true;
    RFNode.sprite.gotoAndStop(2);
}

function on_EditorRFNode_MouseUp() {
    if (RFNode.MouseDownFirst == true)
    {
        createNode(MyEditor.House.center.x, MyEditor.House.center.y, "RFNode.png");
    }
    RFNode.MouseDownFirst = false;
    RFNode.sprite.gotoAndStop(1);

}

function createEditorRFNode(x, y)
{
    var texture = PIXI.Texture.fromImage("RFNode.png");
    var textureHover = PIXI.Texture.fromImage("RFNodeHover.png");
    var textureDown = PIXI.Texture.fromImage("RFNodeDown.png");
    var textures = [texture, textureHover, textureDown];
    //var EditorElement = PIXI.MovieClip.prototype.fromImages(["RFNode.png", "RFNodeHover.png"]);
    var EditorElement = new PIXI.MovieClip(textures);
    //var EditorElement = new PIXI.Sprite.fromImage(fileName);
    EditorElement.interactive = true;
    EditorElement.buttonMode = true;
    EditorElement.anchor.set(0.5);
    EditorElement.scale.set(0.5);
    EditorElement
            // events for drag start
            .on('mousedown', on_EditorRFNode_MouseDown)
            .on('touchstart', on_EditorRFNode_MouseDown)
            // events for drag end
            .on('mouseup', on_EditorRFNode_MouseUp)
            .on('touchend', on_EditorRFNode_MouseUp)
    EditorElement.mouseover = function (data) {
        //Display the hover texture
        EditorElement.gotoAndStop(1);
    }
    EditorElement.mouseout = function (data) {
        //Display the normal texture
        EditorElement.gotoAndStop(0);
    }
    // move the sprite t the center of the screen
    EditorElement.position.x = x;
    EditorElement.position.y = y;

    stage.addChild(EditorElement);

    RFNode.sprite = EditorElement;
}

    function createNodeCommon(node, x, y, onDragEvent)
    {
        node.interactive = true;
        node.buttonMode = true;
        node.anchor.set(0.5);
        node.scale.set(0.5);
        node
                // events for drag start
                .on('mousedown', onDragStart)
                .on('touchstart', onDragStart)
                // events for drag end
                .on('mouseup', onDragEvent)
                .on('mouseupoutside', onDragEvent)
                .on('touchend', onDragEvent)
                .on('touchendoutside', onDragEvent)
                // events for drag move
                .on('mousemove', onDragMove)
                .on('touchmove', onDragMove);

        // move the sprite t the center of the screen
        node.position.x = x;
        node.position.y = y;

        stage.addChild(node);
    }

    function createNode(x, y, fileName,isEditor) {
        var texture = PIXI.Texture.fromImage(fileName);
        var node = new PIXI.Sprite(texture);
        createNodeCommon(node, x, y, onDragRFEnd);
        if (!isEditor)
        {
            node.Params = { Power: -83 };
            
            var NodeName = 'rfNode ' + (Nodes.length ).toString();
            var f1 = MyEditor.gui.addFolder(NodeName);
            f1.add(node.Params, 'Power');
            f1.add(node.position, 'x');

            


            Nodes.push(node);
        }
    }

    function createNoise(x, y, fileName, isEditor) {
        var texture = PIXI.Texture.fromImage(fileName);
        var node = new PIXI.Sprite(texture);
        createNodeCommon(node, x, y, onNoiseDragEnd);
        if (!isEditor) {
            Noises.push(node);
        }

    }


    function createObstacle(x, y, fileName, isEditor) {
        var texture = PIXI.Texture.fromImage(fileName);
        var node = new PIXI.Sprite(texture);
        createNodeCommon(node, x, y, onObstDragEnd);
        if (!isEditor) {
            Obstacles.push(node);
        }

    }

    function createEditor(w, h) {
        MyEditor = new Object();

        MyEditor.width = w;
        MyEditor.height = h;


        MyEditor.House = new Object();
        MyEditor.House.x = w * 0.2;
        MyEditor.House.y = 1;
        MyEditor.House.width = w - MyEditor.House.x - 1;
        MyEditor.House.height = h - 2;
        MyEditor.House.center = {};
        MyEditor.House.center.x = MyEditor.House.x + MyEditor.House.width / 2;
        MyEditor.House.center.y = MyEditor.House.y + MyEditor.House.height / 2;

        var HouseBkg = new PIXI.Graphics();
        HouseBkg.lineStyle(5, 0x0000FF, 1);

        HouseBkg.beginFill(0xFFFFFF, 1);
        HouseBkg.drawRect(MyEditor.House.x, MyEditor.House.y, MyEditor.House.width, MyEditor.House.height);
        HouseBkg.endFill();
        stage.addChild(HouseBkg);

        MyEditor.ObjectsPanel = new Object();
        MyEditor.ObjectsPanel = new Object();
        MyEditor.ObjectsPanel.x = 1;
        MyEditor.ObjectsPanel.y = 1;
        MyEditor.ObjectsPanel.width = w * 0.2 -1;
        MyEditor.ObjectsPanel.height = h - 2;
        MyEditor.ObjectsPanel.center = {};
        MyEditor.ObjectsPanel.center.x = MyEditor.ObjectsPanel.x + MyEditor.ObjectsPanel.width / 2;
        MyEditor.ObjectsPanel.center.y = MyEditor.ObjectsPanel.y + MyEditor.ObjectsPanel.height / 2;

        var PanelBkg = new PIXI.Graphics();
        PanelBkg.lineStyle(5, 0x0000FF, 1);

        PanelBkg.beginFill(0xFFFFFF, 1);
        PanelBkg.drawRect(MyEditor.ObjectsPanel.x, MyEditor.ObjectsPanel.y, MyEditor.ObjectsPanel.width, MyEditor.ObjectsPanel.height);
        PanelBkg.endFill();
        stage.addChild(PanelBkg);


        RFNode = new Object();
        RFNode.MouseDownFirst = false;
        RFNode.x = MyEditor.ObjectsPanel.center.x;
        RFNode.y = MyEditor.ObjectsPanel.height / 4;
        createEditorRFNode(RFNode.x, RFNode.y);

        Noise = new Object();
        Noise.x = MyEditor.ObjectsPanel.center.x;
        Noise.y = 2 * MyEditor.ObjectsPanel.height / 4;
        createNoise(Noise.x, Noise.y, "Noise.png", true);

    
        Obstacle = new Object();
        Obstacle.x = MyEditor.ObjectsPanel.center.x;
        Obstacle.y = 3 * MyEditor.ObjectsPanel.height / 4;
        createObstacle(Obstacle.x, Obstacle.y, "Obstacle.png", true);

        //creating the Gui
        MyEditor.gui = new dat.GUI();
        var obj = { rfNodePower: -82 };
        MyEditor.gui.add(obj, 'rfNodePower');

        /*$.getJSON('ObjectsList.json', function (obj) {
            var ListLength = obj.elements.length;
            for (var i = 0; i < ListLength; i++)
            {
                createNode(obj.elements[i].x, obj.elements[i].y, obj.elements[i].fileName);
            }
        });*/
    }
