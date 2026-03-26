"use strict";

/*
 Simple Platformer Prototype
*/

const canvasWidth = 800;
const canvasHeight = 600;

let ctx;
let game;
let oldTime = 0;

const gravity = 0.002;
const playerSpeed = 0.4;
const jumpForce = -0.9;


// VECTOR
class Vector{

    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    plus(other){
        return new Vector(this.x + other.x, this.y + other.y);
    }

    times(num){
        return new Vector(this.x * num, this.y * num);
    }

}


// BASE OBJECT
class GameObject{

    constructor(position,width,height,color){

        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;

    }

    draw(ctx){

        ctx.fillStyle = this.color;

        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

}


// PLAYER
class Player extends GameObject{

    constructor(position,width,height,color){

        super(position,width,height,color);

        this.velocity = new Vector(0,0);
        this.onGround = false;

        this.keys = [];
    }

    update(deltaTime, platforms){

        this.velocity.x = 0;

        if(this.keys.includes("left")){
            this.velocity.x = -playerSpeed;
        }

        if(this.keys.includes("right")){
            this.velocity.x = playerSpeed;
        }

        this.velocity.y += gravity * deltaTime;

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        this.onGround = false;

        for(let platform of platforms){

            if(boxOverlap(this,platform)){

                if(this.velocity.y > 0){

                    this.position.y = platform.position.y - this.height;

                    this.velocity.y = 0;

                    this.onGround = true;

                }

            }

        }

        this.clamp();
    }

    jump(){

        if(this.onGround){
            this.velocity.y = jumpForce;
            this.onGround = false;
        }

    }

    clamp(){

        if(this.position.x < 0){
            this.position.x = 0;
        }

        if(this.position.x + this.width > canvasWidth){
            this.position.x = canvasWidth - this.width;
        }

        if(this.position.y + this.height > canvasHeight){

            this.position.y = canvasHeight - this.height;

            this.velocity.y = 0;

            this.onGround = true;
        }

    }

}


// GAME CLASS
class Game{

    constructor(){

        this.createEventListeners();
        this.initObjects();

    }

    initObjects(){

        this.player = new Player(
            new Vector(200,200),
            40,
            40,
            "red"
        );

        this.platforms = [];

        this.addPlatform(0,560,800,40);
        this.addPlatform(200,450,200,20);
        this.addPlatform(500,380,200,20);
        this.addPlatform(350,300,150,20);

    }

    addPlatform(x,y,w,h){

        const p = new GameObject(
            new Vector(x,y),
            w,
            h,
            "grey"
        );

        this.platforms.push(p);
    }

    update(deltaTime){

        this.player.update(deltaTime,this.platforms);

    }

    draw(ctx){

        for(let p of this.platforms){
            p.draw(ctx);
        }

        this.player.draw(ctx);

    }

    createEventListeners(){

        window.addEventListener("keydown",(event)=>{

            if(event.key === "a"){
                this.addKey("left");
            }

            if(event.key === "d"){
                this.addKey("right");
            }

            if(event.key === " "){
                this.player.jump();
            }

        });

        window.addEventListener("keyup",(event)=>{

            if(event.key === "a"){
                this.delKey("left");
            }

            if(event.key === "d"){
                this.delKey("right");
            }

        });

    }

    addKey(dir){

        if(!this.player.keys.includes(dir)){
            this.player.keys.push(dir);
        }

    }

    delKey(dir){

        const index = this.player.keys.indexOf(dir);

        if(index > -1){
            this.player.keys.splice(index,1);
        }

    }

}


// COLLISION
function boxOverlap(a,b){

    return(

        a.position.x < b.position.x + b.width &&
        a.position.x + a.width > b.position.x &&
        a.position.y < b.position.y + b.height &&
        a.position.y + a.height > b.position.y

    );

}


// MAIN
function main(){

    const canvas = document.getElementById("canvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d");

    game = new Game();

    drawScene(0);
}


// LOOP
function drawScene(newTime){

    const deltaTime = newTime - oldTime;

    ctx.clearRect(0,0,canvasWidth,canvasHeight);

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;

    requestAnimationFrame(drawScene);

}