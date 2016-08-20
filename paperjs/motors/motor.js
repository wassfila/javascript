//var Home = false;//will be intialised in rfmsch.js


	function GetMagPosFromParam(pos,radius,nbMag,id){
		radius = radius * 0.8;
		var MagWidth = (radius * 2 *Math.PI) * 0.8 / nbMag;
		var MagHeight = 10;
		var Magnet = new Path.Rectangle(pos.x+radius-MagHeight/2,pos.y-MagWidth/2,MagHeight,MagWidth);
		if((id % 2) == 0)
		{
			Magnet.fillColor = 'red';
		}
		else
		{
			Magnet.fillColor = 'blue';
		}
		Magnet.rotate(-id*360/nbMag,pos);
		return Magnet;
	}

	function GetWindingFromParam(pos,nbPoles,id){
		var windKernWidth = 100;
		var windKernHeight = 10;
		var winding = new Path.Rectangle(pos.x,pos.y-windKernHeight/2,windKernWidth,windKernHeight);
		var c = 'black';
		if(nbPoles == 3)
		{
			switch(id)
			{
				case 0: c = 'blue'; break;
				case 1: c = 'red'; break;
				case 2: c = 'green'; break;
			}
		}
		else if(nbPoles == 12)
		{
			var winType = 2;
			if(winType == 1)
			{
				switch(id)
				{
					case 0: c = 'blue'; break;
					case 1: c = 'blue'; break;
					case 2: c = 'red'; break;
					case 3: c = 'red'; break;
					case 4: c = 'green'; break;
					case 5: c = 'green'; break;
					case 6: c = 'blue'; break;
					case 7: c = 'blue'; break;
					case 8: c = 'red'; break;
					case 9: c = 'red'; break;
					case 10: c = 'green'; break;
					case 11: c = 'green'; break;
				}
			}
			else
			{
				switch(id)
				{
					case 0: c = 'blue'; break;
					case 1: c = 'red'; break;
					case 2: c = 'green'; break;
					case 3: c = 'blue'; break;
					case 4: c = 'red'; break;
					case 5: c = 'green'; break;
					case 6: c = 'blue'; break;
					case 7: c = 'red'; break;
					case 8: c = 'green'; break;
					case 9: c = 'blue'; break;
					case 10: c = 'red'; break;
					case 11: c = 'green'; break;
				}
			}
		}
		winding.fillColor = c;
		winding.rotate(-id*360/nbPoles,pos);
		return winding;
	}
	//--------------------------- Motor ------------------------------------
    function Motor(pos,nbPoles,nbMag) {
		//12N 14P
        this.nbPoles = nbPoles;
		this.nbMag = nbMag;
		this.radius = 140;
        this.position = pos;
		this.mouseEdit = false;
		var OuterFrame = new Path.Circle({
									center: pos,
									radius: this.radius,
									fillColor:'#0088cc'
									});
		OuterFrame.fillColor = {
			gradient:{
						stops: [	
							[new Color(0,1,0), 0.1], 
							[new Color(0,1,0,0.3), 0.8], 
							[new Color(0,1,0,0.9), 0.9], 
							[new Color(0,1,0,1), 1]],
						//stops:[ ['blue',0.05], ['green',1] ],
						radial: true
						},
			origin:pos,
			destination:OuterFrame.bounds.rightCenter
		};
		OuterFrame.opacity = 0.3;
		this.rotor = new Group();
		this.rotor.addChild(OuterFrame);
		this.stator = new Group();
		
		//var winding = GetWindingFromParam(pos,12,0);
        var kernel = new Path.Circle({
									center: pos,
									radius: 15,
									fillColor:'black'
									});
		for(var i = 0;i<nbPoles;i++)
		{
			this.stator.addChild(GetWindingFromParam(pos,nbPoles,i));
		}
		for(var i = 0;i<nbMag;i++)
		{
			this.rotor.addChild(GetMagPosFromParam(pos,this.radius,nbMag,i));
		}
		
		this.stator.addChild(kernel);
		this.stator.opacity = 0.5;
		
    }

    Motor.prototype = {
        moveTo: function(pos) {
			this.position = pos;
            this.rotor.position = pos;
			this.stator.position = pos;
        },
		onFrame: function(relativeInSlot)
		{
			console.log(relativeInSlot);
			//this.rotor.orientate(relativeInSlot * 2 * Math.PI / 3000);
			this.rotor.rotation = (relativeInSlot * 360 / 3000) * 4 / this.nbMag;
			//lastRot = relativeInSlot;
			//var newRot = relativeInSlot;
			//this.rotor.rotate( relativeInSlot * 1);
			//this.rotor.rotate( 360 / 1000);
			/*this.stator.fillColor.gradient.stops = [	
						[new Color(0,1,0), 0.1], 
						[new Color(0,1,0,0.3), 0.8], 
						[new Color(0,1,0,0.9), 0.9], 
						[new Color(0,1,0,0.0), 1]]
			this.stator.opacity = 0.15;*/
		}
    };

	//--------------------------- Sequence ------------------------------------
    function Sequence() {
		this.Period = 3*1000;
		var d = new Date();
		this.start = d.getTime();
    }
	//--------------------------- Scene ------------------------------------
    function Scene() {
		this.w = view.size.width;
		this.h = view.size.height;
		this.c = new Point([view.size.width/2, view.size.height/2]);
        this.Nodes = [];
		this.NbNodes = 2;//1 motor
		this.createMotor();
		this.sequence = new Sequence();//in ms
    }

    Scene.prototype = 
	{
        createMotor: function() {
			
				var nodePos = new Point([this.w * 0.25 , this.h * 0.5]);
				this.Nodes.push(new Motor(nodePos,3,4));
				var nodePos = new Point([this.w * 0.75 , this.h * 0.5]);
				this.Nodes.push(new Motor(nodePos,12,14));
        }
		,
		randomiseNodesPositions: function(){
			for (var i = 0; i < this.NbNodes; i++) 
			{
				var newpoint = new Point([Math.random() * this.w * 0.6 +this.h * 0.2, Math.random() * this.h * 0.6 + this.h * 0.2]);
				this.Nodes[i].moveTo(newpoint);
			}
		}
		,
        mouseMove: function(event) {
			for (var i = 0; i < this.NbNodes; i++) {
				var dist = event.point - this.Nodes[i].position;
				if(this.Nodes[i].mouseEdit)
				{
					this.Nodes[i].moveTo(event.point);
				}
			}
        },
		mouseDown: function(event){
			var selectedOnce = false;
			for (var i = 0; (i < this.NbNodes) &&(!selectedOnce); i++) {
				var dist = event.point - this.Nodes[i].position;
				if(dist.length <35)
				{
					this.Nodes[i].mouseEdit = true;
					selectedOnce = true;//break the loop
					
				}
				else
				{
					this.Nodes[i].mouseEdit = false;
				}
			}
		},
		mouseUp: function(event){
			for (var i = 0; i < this.NbNodes; i++)
				{
					this.Nodes[i].mouseEdit = false;
				}
		},
		onFrame: function(event){
			
			var d = new Date();
			var relativeTimeNow = (d.getTime() ) % this.sequence.Period;
			
			console.log(relativeTimeNow);
			for(var i = 0;i < this.NbNodes; i++)
			{
				this.Nodes[i].onFrame(relativeTimeNow);
				
			}
		},
		resize: function(){
			this.w = view.size.width;
			this.h = view.size.height;
			this.c = new Point([view.size.width/2, view.size.height/2]);
		}
		
    };


			
Home = new Scene();

//export { Home };