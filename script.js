// console.log("lets do javascript");
 let currentSong = new Audio();
 let songas;
 let currFolder;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currFolder=folder;
  let a = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
  let response = await a.text();
  // console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
   songas = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songas.push(element.href.split(`/${currFolder}/`)[1]);
    }
  }
  let songul = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
    songul.innerHTML=""
  //here we use for of loop
  for (const song of songas) {
    songul.innerHTML =
      songul.innerHTML +
      `<li><img class="invert"
                    src="music.svg" alt="">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Harry</div>
                    </div>
                    <div class="playnow"><span>Play Now</span>
                        <img class="invert" src="play.svg" alt="">
                    </div>
                    </li>`;
  }
  //attach event listener to all songs
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });


}
const playMusic=(track,pause=false)=>{
    //let audio=new Audio("/songs/"+track)
    //for playing current songs 
    currentSong.src = `/${currFolder}/` + track;
    if(!pause){
      currentSong.play();
        play.src = "pause.svg";
    }
    
  
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00.00"
}
async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer");
  let array= Array.from(anchors)
  for(let index=0;index<array.length;index++){
    const e=array[index]
      if(e.href.includes("songs/")){
        console.log(e.href)
      let folder = (e.href.split("/songs/").slice(-1)[0])
      console.log(folder)
    //now we get meta data from the folder 
let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
let response = await a.json();
console.log(response)
cardContainer.innerHTML =
  cardContainer.innerHTML +
  `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#000"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 20V4L19 12L5 20Z"
                    stroke="#141B34"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`;
    }
    }
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
      e.addEventListener("click", async (item) => {
         console.log(item,item.currentTarget.dataset)
        songas = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        //  playMusic(songas[0])

      });
    });

}
async function main() {
   
  //get list of all the songs
   await getsongs("songs/ncs");
 playMusic(songas[0],true)
  // console.log(songas);
  //Display all Albums on the page 
  displayAlbums()


 
//attach an event listener to play next and previous
play.addEventListener("click",()=>{
  if(currentSong.paused){
    currentSong.play()
    play.src="pause.svg"
  }
  else{
    currentSong.pause()
    play.src="play.svg"
  }
})
//Listen for timeupdate event 
currentSong.addEventListener("timeupdate",()=>{
  // console.log(currentSong.currentTime,currentSong.duration)
document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
})
//add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click",(e)=>{
//console.log(e.target.getBoundingClientRect(),e.offsetX)
let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
document.querySelector(".circle").style.left = percent+"%";
currentSong.currentTime=((currentSong.duration)*percent)/100;
})
//add and event listener for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "0";})
document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "-120%";
})
//add a event listener on previous and next
previous.addEventListener("click",()=>{
  let index = songas.indexOf(currentSong.src.split("/").slice(-1)[0]);
  // console.log(index);
  if((index-1)>=0)
{
  playMusic(songas[index-1])
}
})
next.addEventListener("click",()=>{
// console.log(songas)
let index = songas.indexOf(currentSong.src.split("/").slice(-1)[0]);

if((index+1)<songas.length){
playMusic(songas[index+1])
}

})
//add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  //now we are setting the volume of music player 
  currentSong.volume=parseInt(e.target.value)/100
})
//whenever card is click play the song 

}

main();
