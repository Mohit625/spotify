let currsong = new Audio();
let masterplay = document.querySelector("#play");
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
let info = document.querySelector(".songinfo");
let time = document.querySelector(".songtime");
let progress = document.querySelector(".seekbar");
let s;
let volumebar = document.querySelector(".volumebar");
function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds<0) {
      return '';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }
async function getsongs(){
let a = await fetch("http://127.0.0.1:3000/songs/");
let response = await a.text();
let div = document.createElement("div");
div.innerHTML = response;
let as = div.getElementsByTagName("a");
let songs = [];
for(let i=0;i<as.length;i++){
    const element = as[i];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split("/songs/")[1].replaceAll("%20"," ",));
    }
}
return songs;
}
const playmusic = (track)=>{
    currsong.src = ("/songs/" + track);
    currsong.play();
    currsong.volume = .50;
    masterplay.src = "imgs/pause.svg"
    info.innerHTML = track
    time.innerHTML = "00/00";
}
async function main(){
s =  await getsongs();
let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
for (const song of s) {
    songul.innerHTML = songul.innerHTML + `<li>
    <img class="invert" src="imgs/music.svg" alt="">
    <div>${song}</div>
    <div class="playnow"><img class="invert" src="imgs/play1.svg" alt="">play now</div>
</li>`;
}
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
   e.addEventListener("click",()=>{
       console.log(e.querySelector("div").innerHTML);
      playmusic(e.querySelector("div").innerHTML.trim());
})
})
masterplay.addEventListener("click" ,()=>{
    if(currsong.paused){
        currsong.play();
        masterplay.src = "imgs/pause.svg"
    }
    else{
        currsong.pause();
        masterplay.src = "imgs/play1.svg";
    }
})
currsong.addEventListener("timeupdate",()=>{
    time.innerHTML = `${secondsToMinutesAndSeconds(currsong.currentTime)}/${secondsToMinutesAndSeconds(currsong.duration)}`
    progress.value = parseInt((currsong.currentTime / currsong.duration)*100);
})
progress.addEventListener("change",()=>{
    currsong.currentTime = (progress.value*currsong.duration)/100;
})
previous.addEventListener("click",()=>{
    console.log("previous clicked");
    let index = s.indexOf(currsong.src.split("/songs/")[1].replaceAll("%20"," ",));
    console.log(currsong.src);
    console.log(s,index);
    if(index-1 >= 0){
    playmusic(s[index-1]);}
})
next.addEventListener("click",()=>{
    console.log("next clicked");
    let index = s.indexOf(currsong.src.split("/songs/")[1].replaceAll("%20"," ",));
    console.log(currsong.src);
    console.log(s,index);
    if(index+1 < s.length){
    playmusic(s[index+1]);}
    else{
        next.removeEventListener();
    }
})
volumebar.addEventListener("change",(e)=>{
    currsong.volume = parseInt(e.target.value)/100 ;
    if(e.target.value == 0){
        icon.src = "imgs/mute.svg";
    }
    else{
        icon.src="imgs/volume.svg"
    }
})
document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("imgs/volume.svg")){
        e.target.src = e.target.src.replace("imgs/volume.svg", "imgs/mute.svg")
        currsong.volume = 0;
        volumebar.value = 0;
    }
    else{
        e.target.src = e.target.src.replace("imgs/mute.svg", "imgs/volume.svg")
        currsong.volume = .30;
        volumebar.value = 30;
    }

})

document.querySelector(".hamburgericon").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0"; 
    document.querySelector(".close").style.display = "block";
})
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-120%"; 
})
}
main();