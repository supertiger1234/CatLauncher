import { Player } from "./Player.js";
import { Terrain } from "./Terrain.js";
import { NetworkManager } from "./NetworkManager.js";
import { ConnectionStatus } from "./UI/ConnectionStatus.js";
import { DebugDetails } from "./UI/DebugDetails.js";
/**
@param {CanvasRenderingContext2D} context
@param {HTMLCanvasElement} canvas
/*/
export function GameEngine(context, canvas) {
    self = this;
    this.fps = 0;
    this.context = context;
    this.canvas = canvas;
    this.networkManager = new NetworkManager(this);
    this.mouse = {x: 0, y: 0, mouseBtn1: false, keyPressed: {}}
    this._lastCalledTime = 0;

    document.addEventListener("mousemove", (event) => {
        this.mouse.x = event.pageX;
        this.mouse.y = event.pageY;
    });
    document.addEventListener("mousedown", (event) => {
        this.mouse.mouseBtn1 = true;
    });
    document.addEventListener("mouseup", (event) => {
        this.mouse.mouseBtn1 = false;
    });
    document.addEventListener("keyup", event => {
        this.mouse.keyPressed[event.key] = 0;
    })
    document.addEventListener("keydown", event => {
        this.mouse.keyPressed[event.key] = 1;
    })


    this.terrain = new Terrain(canvas.width, canvas.height);
    /**
     * @type {Array.<Player>}
     * @const
     */
    this.players = {};
    // UI
    this.connectionStatus = new ConnectionStatus(this);
    this.debugDetails = new DebugDetails(this);

    this.update = function (delta) {
        for (let key in this.players) {
            this.players[key].update(delta);            
        }
        this.connectionStatus.update();
        this.debugDetails.update();
    }
    this.draw = function () {
        this.terrain.draw(context);
        
        for (let key in this.players) {
            this.players[key].draw();            
        }

        this.connectionStatus.draw();
        this.debugDetails.draw();
    }
    this.frame = function(time) {
        // fps counter
        if(!self.lastCalledTime) {
            self.lastCalledTime = time
            self.fps = 0;
        }
        const delta = (time - self.lastCalledTime)/1000;
        self.lastCalledTime = time
        self.fps = 1/delta;
        context.clearRect(0,0, canvas.width, canvas.height)
        context.setTransform(1, 0, 0, 1, 0, 0); // reset transform
        self.update(delta);
        self.draw(); 
        
        requestAnimationFrame(self.frame)

    }
    this.frame();


}