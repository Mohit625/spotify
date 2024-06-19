let currsong = new Audio();
let currfolder;
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
async function getsongs(folder){
    currfolder = folder;
let a = await fetch(`/${folder}/`);
let response = await a.text();
let div = document.createElement("div");
div.innerHTML = response;
let as = div.getElementsByTagName("a");
let songs = [];
for(let i=0;i<as.length;i++){
    const element = as[i];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1].replaceAll("%20"," ",));
    }
}
let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
songul.innerHTML = "";
for (const song of songs) {
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
return songs;
}
const playmusic = (track, pause = false)=>{
    currsong.src = (`/${currfolder}/` + track);
    if (!pause) {
        currsong.play();
        currsong.volume = .50;
        masterplay.src = "imgs/icons8-pause-48.png"
    }
    info.innerHTML = decodeURI(track);
    time.innerHTML = "";
}
async function main(){
s =  await getsongs("library/Happy");
    playmusic(s[0], true);
masterplay.addEventListener("click" ,()=>{
    if(currsong.paused){
        currsong.play();
        masterplay.src = "imgs/icons8-pause-48.png"
    }
    else{
        currsong.pause();
        masterplay.src = "imgs/icons8-play-48.png";
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
    let index = s.indexOf(currsong.src.split(`/${currfolder}/`)[1].replaceAll("%20"," ",));
    console.log(currsong.src);
    console.log(s,index);
    if(index-1 >= 0){
    playmusic(s[index-1]);}
})
next.addEventListener("click",()=>{
    console.log("next clicked");
    let index = s.indexOf(currsong.src.split(`/${currfolder}/`)[1].replaceAll("%20"," ",));
    console.log(currsong.src);
    console.log(s,index);
    if(index+1 < s.length){
    playmusic(s[index+1]);}
    else{
        next.removeEventListener();
    }
})
    volumebar.addEventListener("change", (e) => {
        currsong.volume = parseInt(e.target.value) / 100;
        if (e.target.value == 0) {
            icon.src = "imgs/volume-off-outline.svg";
        }
        else if (e.target.value > 0 && e.target.value <= 33) {
            icon.src = "imgs/volume-mute-outline.svg";
        }
        else if (e.target.value > 33 && e.target.value <= 65) {
            icon.src = "imgs/volume-down-outline.svg";
        }
        else {
            icon.src = "imgs/volume-up-outline.svg";
        }
    })
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("imgs/volume-mute-outline.svg") || e.target.src.includes("imgs/volume-down-outline.svg") || e.target.src.includes("imgs/volume-up-outline.svg")) {
            e.target.src = "imgs/volume-off-outline.svg";
            currsong.volume = 0;
            volumebar.value = 0;
        }
        else {
            e.target.src = e.target.src.replace("imgs/volume-off-outline.svg", "imgs/volume-mute-outline.svg")
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
Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
        console.log("Fetching Songs")
        songs = await getsongs(`library/${item.currentTarget.dataset.folder}`)  
        playmusic(songs[0])

    })
})
   
}
main();
