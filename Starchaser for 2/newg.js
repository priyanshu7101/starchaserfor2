let file;
let b1, b2;
let keys;
let ppos, scaling;
let time;
let stars=[];
let rocket=[];
let flame, flame2, cold;
let l1, l2;
let l1l2=0.99;
let backStars=200;
function preload(){
  file = createAudio('data/hit.wav');
  file.volume(0.25);
  for (let i=0; i<4; i++) {
    //stars[i]=loadImage("data/"+(1+i)+".png");
    stars[i]=loadImage("data/1.png");
  }
  flame=loadImage("data/flame.png");
  flame2=loadImage("data/flame2.png");
  rocket[0]=loadImage("data/rocket1.png");
  rocket[1]=loadImage("data/rocket2.png");

}
function setup() {
  createCanvas(windowWidth-1, windowHeight-1);
  scaling =createVector(0,0);
  scaling.x=width/1280.;
  scaling.y=height/760.;
  b1=new boy(50, 50);
  b2=new boy(100, 50);
  ppos=createVector(500, 500); 
  
  l1=createGraphics(1360, 770);
  l2=createGraphics(int(1360*l1l2), int(770*l1l2));
  space(l1, 1);
  space(l2, l1l2);
  noSmooth();
  keys=createNumberDict("512",0);
  for (let ch=0; ch<512; ch++)
    keys.create(""+ch, 0);
  textSize(20);
  score=-1;
  time=0;
}

function windowResized() {
  resizeCanvas(windowWidth-1, windowHeight-1);
  scaling.x=width/1280.;
  scaling.y=height/760.;
}

function draw() {
  image(stars[1],0,0);
  scale(scaling.x, scaling.y);
  background(0);
  image(l1, b2.pos.x*(1-l1l2), b2.pos.y*(1-l1l2));
  image(l2, b1.pos.x*(1-l1l2), b1.pos.y*(1-l1l2));
  //fill(0xffaaaaaa);  rect(50, 50, 600, 600);
  fill(0xffffffff);
  keyRoutine();
  b1.update(0);
  b2.update(1);
  //text(int(b1.acc.dir.x)+","+int(b1.acc.dir.y)+"\n"+int(b1.acc.t.x)+","+int(b1.acc.t.y), 400, 400);
  //ellipse(pos.x-15, pos.y-15, 30, 30);//hitbox
  image(stars[int(time/15)%4], ppos.x-20, ppos.y-20, 40, 40);
  stroke(255);
  strokeWeight(1);
  noFill();
  textSize(40);
  rect(700, 140, 60, 60);
  text("A", 700+20, 140+50);//a
  rect(760, 140, 60, 60);
  text("S", 760+20, 140+50);//s
  rect(820, 140, 60, 60);
  text("D", 820+20, 140+50);//d
  rect(760, 80, 60, 60);
  text("W", 760+20, 80+50);//w
  rect(1000, 140, 60, 60);
  text("P", 1000+20, 140+50);//p
  textSize(25);
  text("WASD/arrow keys\n to Move", 700, 240);
  text("O/P To Restart", 1000, 240);
  b1.points(ppos);
  b2.points(ppos);
  time++;
  text("score="+b1.score+"\ntime="+time+"\nratio="+int(600000*b1.score/time)/100, 700, 400);
  text("score="+b2.score+"\ntime="+time+"\nratio="+int(600000*b2.score/time)/100, 1000, 400);
}

function keyPressed() {
  let qwe=1;
  keys.set(""+keyCode, qwe);
  print(keyCode==""+char(keyCode),);
}
function keyReleased() {
  let qwe=1;
  keys.set(""+keyCode, 0);
  print(keys.get(""+unchar('W')))
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

  if (keys.get(""+unchar('O'))===1) {
    b1.pos=new PVector(50, 50);
    score*=0.8;
  }
  if (keys.get(""+unchar('P'))===1) {
    b2.pos=new PVector(50, 50);
    score*=0.8;
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

  constructor(a, b) {
    this.acc=new timed2d(0,0,0,0);
    this.score=0;
    this.pos=createVector(a, b);
    this.vel=createVector();
  }
  update( i) {
    this.vel=this.vel.mult(0.90);
    this.vel=this.vel.add(this.acc.giveUp());
    this.pos=this.pos.add(this.vel);

    this.drawBoy(i);
    //ellipse(this.pos.x, this.pos.y,20,20);//hitbox
  }
  addTimed(a) {
    this.acc.addTimed(a);
    this.acc.dir.limit(1);
  }
  drawBoy(i) {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(atan2(this.vel.x, -this.vel.y));
    let flameSize=4*int(this.vel.mag());
    if(i==1)image(flame2, 2-flameSize/2, 50, flameSize, flameSize);
    else image(flame, 2-flameSize/2, 50, flameSize, flameSize);
    image(rocket[i], -25, 0, 50, 50);
    
    pop();
  }

  points(ppo) {
    if (this.pos.dist(ppo)<30) {
      ppos=createVector(random(50, 600), random(50, 600));
      this.score++;
      file.stop();
      file.play();
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