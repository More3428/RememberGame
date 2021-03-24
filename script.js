//Global Constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [3, 4, 3, 5, 2, 4, 6, 8];
var progress = 0;
var guessCounter = 0; 
var gamePlaying = false;
var tonePlaying = false; 
var volume = 0.3; 
 

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence(); 
}

function stopGame(){
  gamePlaying = false; 
  document.getElementById("startBtn").classList.remove("hidden"); 
  document.getElementById("stopBtn").classList.add("hidden"); 
}


function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")

}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0; 
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Congragulations, You Win!")
}

function guess(btn){
  console.log("user guessed: " + btn);
   if(!gamePlaying){
    return;
  }
  // add game logic here
  if( pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame(); 
      }else{
        progress++;
        playClueSequence(); 
      } 
      }else{
        guessCounter++
      }
    }  else{
      loseGame(); 
    }
  }



// Sound Synthesis Functions
const freqMap = {
  1: 80.6,
  2: 50.6,
  3: 125.1,
  4: 106.2,
  5: 154.2,
  6: 200.7,
  7: 400.3,
  8: 300, 
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

