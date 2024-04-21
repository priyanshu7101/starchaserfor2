let hit_sound=[];
let b1, b2;
let keys;
let ppos, scaling,phone_scaling,pc_scaling;
let time=0;
let stars=[];
let rocket=[];
let flame, flame2, cold;
let l1, l2;
let l1l2=0.99;
let backStars=200;
let mobile=false;
let returnButton=false;
let rotationXoffset,rotationYoffset;
let center,friction;
let disasters;
let disaster_codes=["blindness","Wormholes","BlackHole","Asteroids","Speed Demon"];
function preload(){
  hit_sound[0] = createAudio('data/hit.wav');
  hit_sound[0].volume(0.25);
  hit_sound[1] = createAudio('data/hit1.wav');
  hit_sound[1].volume(0.25);
  for (let i=0; i<4; i++) {
    stars[i]=loadImage("data/"+(i+1)+".png");
  }
  flame=loadImage("data/flame.png");
  flame2=loadImage("data/flame2.png");
  rocket[0]=loadImage("data/rocket1.png");
  rocket[1]=loadImage("data/rocket2.png");

}
function setup() {
  createCanvas(windowWidth-1, windowHeight-1);
  scaling =createVector(0,0);
  ppos=createVector(500, 500); 
  phone_scaling=createVector(700, 1280);
  pc_scaling=createVector(1280, 760);
  center=createVector();
  mobile=height>width;
  if (!mobile) {
    scaling.x=width/pc_scaling.x;
    scaling.y=height/pc_scaling.y;
    center=p5.Vector.mult(pc_scaling,0.5);
  } else {
    scaling.x=width/phone_scaling.x;
    scaling.y=height/phone_scaling.y;
    center=p5.Vector.mult(phone_scaling,0.5);
  }  
 
  b1=new boy(250, 250, 1);
  b2=new boy(300, 250, 2);

  l1=createGraphics(1280, 1280);
  l2=createGraphics(int(1280*l1l2), int(1280*l1l2));
  space(l1, 1);
  space(l2, l1l2);
  noSmooth();
  keys=createNumberDict("512",0);
  for (let ch=0; ch<512; ch++)
    keys.create(""+ch, 0);
  textSize(20);
  time=0;
  rotationXoffset=rotationX;
  rotationYoffset=rotationY;

  disasters=new Disaster();
  friction=0.9;
}

function windowResized() {
  resizeCanvas(windowWidth-1, windowHeight-1);

  mobile=height>width;
  if (!mobile) {
    scaling.x=width/pc_scaling.x;
    scaling.y=height/pc_scaling.y;
    center=p5.Vector.mult(pc_scaling,0.5);
  } else {
    scaling.x=width/phone_scaling.x;
    scaling.y=height/phone_scaling.y;
    center=p5.Vector.mult(phone_scaling,0.5);
  }  
}

function draw() {
  if(disasters.linedUp())disasters=new Disaster();

  scale(scaling.x, scaling.y);
  background(0);
  image(l1, b2.pos.x*(1-l1l2), b2.pos.y*(1-l1l2)); 
  image(l2, b1.pos.x*(1-l1l2), b1.pos.y*(1-l1l2));


 // disasters.update();


  //fill(0xffaaaaaa);  rect(50, 50, 600, 600);
  fill(0xffffffff);
  keyRoutine();
  b1.update();
  if(!mobile)b2.update();
  //text(int(b1.acc.dir.x)+","+int(b1.acc.dir.y)+"\n"+int(b1.acc.t.x)+","+int(b1.acc.t.y), 400, 400);
  //ellipse(pos.x-15, pos.y-15, 30, 30);//hitbox
  image(stars[int(time/15)%4], ppos.x-20, ppos.y-20, 40, 40);
  stroke(255);
  
  noFill();
  textSize(40);
  strokeWeight(5);

  if(!mobile){
  rect(700, 140, 60, 60);
  rect(760, 140, 60, 60); 
  rect(820, 140, 60, 60);  
  rect(760, 80, 60, 60);  
  rect(1000, 140, 60, 60);

  strokeWeight(1);
  text("A", 700+20, 140+45);//a
  text("S", 760+20, 140+45);//s
  text("D", 820+20, 140+45);//d
  text("W", 750+20, 80+45);//w
  text("P", 1000+20, 140+45);//p

  
  textSize(25);
  text("WASD/arrow keys\n to Move", 700, 240);
  text("O/P To Restart", 1000, 240);
  }else {
  rect(400,800,250,60)
  strokeWeight(1);
  text("Reset", 400+20, 800+45);
   
    if (touches.length>0&&touches[0].x>400*scaling.x&&touches[0].x<650*scaling.x&&touches[0].y>800*scaling.y&&touches[0].y<860*scaling.y)
    {
      if(!returnButton)
      {b1.pos=createVector(250,250);
      b1.score*=0.8;
      rotationXoffset=rotationX;
      rotationYoffset=rotationY;
      returnButton=true;}
    }else {returnButton=false;}
  }

  b1.points(ppos);
  if(!mobile)b2.points(ppos);
  time++;
  friction=0.9;
 

}

function keyPressed() {
  keys.set(""+keyCode, 1);
}
function keyReleased() {
  keys.set(""+keyCode, 0);

  if (keyCode==unchar('O')) {
    b1.pos=createVector(50, 50);
    b1.score*=0.8;
  }
  if (keyCode==unchar('P')) {
    b2.pos=createVector(50, 50);
    b2.score*=0.8;
  }
}
function keyRoutine() {
  let time1=3, power=0.1;
  if (keys.get(""+unchar('W'))==1)b1.addTimed(new timed2d(0, -power,0, time1));
  if (keys.get(""+unchar('A'))==1)b1.addTimed(new timed2d(-power, 0, time1,0));
  if (keys.get(""+unchar('S'))==1)b1.addTimed(new timed2d(0, power,0, time1));
  if (keys.get(""+unchar('D'))==1)b1.addTimed(new timed2d(power, 0, time1,0));

  if (keys.get(""+38)==1)b2.addTimed(new timed2d(0, -power, 0,time1));
  if (keys.get(""+37)==1)b2.addTimed(new timed2d(-power, 0, time1,0));
  if (keys.get(""+40)==1)b2.addTimed(new timed2d(0, power,0, time1));
  if (keys.get(""+39)==1)b2.addTimed(new timed2d(power, 0, time1,0));

  if (mobile)
  {let yMove=map(rotationX-rotationXoffset,-20,20,-1,1,true),xMove=map(rotationY-rotationYoffset,-25,25,-1,1,true);
    b1.addTimed(new timed2d(power*xMove , power*yMove,time1, time1));
  }
}

function space( t,  k) {//makes background
  //t.beginDraw();
  if (k>=1)background(0x1d2951);
  colorMode(HSB, 255);
  t.noStroke();
  for (let i=0; i<backStars*k; i++) {
    t.fill(color(int(random(0, 255)), 140, 255));
    let s=random(1, 5);
    t.ellipse(random(0, t.width), random(0, t.height), s, s);
  }
  //t.endDraw();
  colorMode(RGB);
}
 
class boy {
  constructor(a, b, i) {
    this.acc=new timed2d(0,0,0,0);
    this.score=0;
    this.streakTime=100;
    this.pos=createVector(a, b);
    this.vel=createVector();
    this.i=i;
    this.streakScore=0;
  }
  update() {
    this.vel=this.vel.mult(friction);
    this.vel=this.vel.add(this.acc.giveUp());
    this.pos=this.pos.add(this.vel);
    this.streakTime-=this.streakTime>0;
    this.drawBoy();
    //ellipse(this.pos.x, this.pos.y,20,20);//hitbox
  }
  addTimed(a) {
    this.acc.addTimed(a);
    this.acc.dir.limit(1);
  }
  drawBoy() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(atan2(this.vel.x, -this.vel.y));
    let flameSize=4*int(this.vel.mag());
    if(this.i==1 && flameSize>0)image(flame2, 2-flameSize/2, 50, flameSize, flameSize);
    if(this.i==2 && flameSize>0) image(flame, 2-flameSize/2, 50, flameSize, flameSize);
    image(rocket[this.i-1], -25, 0, 50, 50);
    pop();

    text("score="+Math.trunc(100*this.score)/100.+"\ntime="+int(time*1.66)/100+"\nratio="+Math.trunc(600000*this.score/time)/100,300*this.i+400-mobile*600, 400+mobile*250);
    noFill();
    stroke(255,2*this.streakTime);
    if(this.streakScore>2)text(int(100*this.streakScore)/100+" X bonus",300*this.i+470-mobile*600, 390-3*(10-this.streakTime/10)+mobile*250);
    fill(0xffffffff);
      

  }

  points(ppo) {
    if (this.pos.dist(ppo)<30+mobile*10) {
      ppos=createVector(random(50, 600), random(50, 600));
      this.streakScore=1+this.streakTime/25.;
      this.score+=this.streakScore;
      this.streakTime=100;
      hit_sound[this.i-1].stop();
      hit_sound[this.i-1].play();
    }
    return ppo;
  }
}

class timed2d {
  constructor(a1, a2, a3, a4) {
   this.dir= createVector(a1, a2);
   this.t=createVector(abs(a3), abs(a4));
  }
  giveUp() {
    let m=createVector(this.dir.x, this.dir.y);
    if (this.t.x>=1)   this.dir.x= this.dir.x*(this.t.x-1)/this.t.x--;
    else {
      m.x=0;
      this.t.x=0;
      this.dir.x=0;
    }
    if (this.t.y>=1)   this.dir.y= this.dir.y*(this.t.y-1)/this.t.y--;
    else {
      m.y=0;
      this.t.y=0;
      this.dir.y=0;
    }
    return m;
  }

  addTimed(a) {
    let tc=createVector(0,0), dirc=createVector(0,0);
    dirc=a.dir.add(this.dir);//correct div by zero
    if (dirc.x!=0) {
      tc.x=(a.t.x*a.dir.x+this.t.x*this.dir.x)/max(0.1, abs(dirc.x))*signum(dirc.x);
      if (tc.x<=-2) {
        dirc.x*=-1;
        tc.x=abs(tc.x+1);
      }
    }
    if (dirc.y!=0) {
      tc.y=(a.t.y*a.dir.y+this.t.y*this.dir.y)/max(0.1, abs(dirc.y))*signum(dirc.y);
      if (tc.y<=-2) {
        dirc.y*=-1;
        tc.y=abs(tc.y+1);
      }
    }
    this.dir=dirc;
    this.t=tc;
  }
  signum(i) {
    return  int(i>=0)-int(i<=0);
  }
}
function signum(i) {
  return  int(i>=0)-int(i<=0);
}
//uncomment update in draw
class Disaster{
  constructor(){
    this.size=150;
    this.timeUntil=random(820,1080);
    this.type=floor(random(5));
    let angle=random(2*PI)
    this.target=createVector(center.x+random(-200,200),center.y+random(-200,200));
    this.pos=createVector(center.x+1000*Math.sin(angle),center.y+1000*Math.cos(angle));
    this.vel=p5.Vector.sub(this.target,this.pos);
    this.vel.setMag(8);
  }
  update(){
    if(this.timeUntil>0){
      --this.timeUntil;
      
    }
    this.wormhole();
    fill(255);
    ellipse(this.pos.x,this.pos.y,this.size,this.size);
    fill(0);
    text(this.type,this.pos.x-20,this.pos.y-20);
    this.pos.add(this.vel);
  }
  linedUp(){
    return (this.timeUntil<0 && this.pos.mag()>2000);
    
  }
  blackHole(){

    let accDir=p5.Vector.sub(this.pos,b1.pos);
    if(accDir.mag() <this.size){
    accDir.setMag(0.8);
    b1.acc.addTimed(new timed2d(accDir.x, accDir.y,1, 1));}

    accDir=p5.Vector.sub(this.pos,b2.pos)
    if(accDir.mag()<this.size){
    accDir.setMag(0.8);
    b2.acc.addTimed(new timed2d(accDir.x, accDir.y,1, 1));}

  }
  asteroid(){
    let accDir=p5.Vector.sub(this.pos,b1.pos);
    if(accDir.mag() <this.size){
    accDir.setMag(-1);
    b1.acc.addTimed(new timed2d(accDir.x, accDir.y,10, 2));}

    accDir=p5.Vector.sub(this.pos,b2.pos)
    if(accDir.mag()<this.size){
    accDir.setMag(-1);
    b2.acc.addTimed(new timed2d(accDir.x, accDir.y,10, 2));}

  }
  speedDemon(){
    friction=0.98;
  }
  wormhole(){


    let accDir=p5.Vector.sub(this.pos,b1.pos);
    if(accDir.mag() <this.size)
    {   
      let teleport = p5.Vector.random2D();
      teleport.mult(300);
      b1.pos.add(teleport);}

    accDir=p5.Vector.sub(this.pos,b2.pos)
    if(accDir.mag()<this.size)
    {   
      let teleport = p5.Vector.random2D();
      teleport.mult(300);
      b2.pos.add(teleport);}

  }
}

