let currentAudio;
let currentlyPlaying;
let clickedMusic;
let playsong;
let currentfolder;
let songs
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const paddedSecs = secs < 10 ? `0${secs}` : secs;
  return `${mins}:${paddedSecs}`;
}
function timeupdate() {
  currentAudio.addEventListener("timeupdate", () => {
    // console.log(currentAudio.duration  , currentAudio.currentTime)
    const runtime = formatTime(currentAudio.currentTime)
    const totaltime = formatTime(currentAudio.duration)
    const persenttime = (currentAudio.currentTime / currentAudio.duration) * 100
    document.querySelector(".duration").innerText = `${runtime} / ${totaltime}`
    document.querySelector(".circle").style.left = persenttime + "%"
  });
  document.querySelector(".length").addEventListener("click", (e) => {
    document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%"
    currentAudio.currentTime = (((e.offsetX / e.target.getBoundingClientRect().width) * 100) * currentAudio.duration) / 100
  });
}
async function getsong(folder) {
  currentfolder = folder
  const data = await fetch(`${folder}`);
  const text = await data.text();
  // console.log(text)
  let div = document.createElement("div")
  div.innerHTML = text
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
      let url = element.href
      songs.push(url)
    }
  }

  let playlist = document.querySelector(".Playlist")
  playlist.innerHTML = ""
  for (let index = 0; index < songs.length; index++) {
    const element = songs[index];
    const snames = decodeURIComponent(element).split("\\").pop();
    const songname = snames.split("-")[0];
    const auther = snames.split("-")[1];
    let list = `<div class="music">
    <img src='assets/images/music.svg' alt="" class="inverte1">
    <div class="info">
              <div>${songname}</div>
              <div>${auther}</div>
              </div>
              <div class="play">
              <img src="assets/images/play.svg" alt="" class="inverte1">
              </div>`
    playlist.insertAdjacentHTML("beforeend", list);

  }
}
getsong()

async function displayAlbum() {
  let a = await fetch(`Songs/`);
  let Response = await a.text();
  // console.log(text)
  let div = document.createElement("div")
  div.innerHTML = Response
  let ancher = div.getElementsByTagName("a")
  let array = Array.from(ancher)
    for (let index = 0; index < array.length; index++) {
      const e = array[index]; 
      if (e.href.includes("Songs") || e.href.includes("Music")) {
         console.log(e.href.split("/").slice(-2)[0].replaceAll("%5C","/").split("/").slice(-1)[0])
        let data = e.href.split("/").slice(-2)[0].replaceAll("%5C","/").split("/").slice(-1)[0]
        let a = await fetch(`Songs/${data}/info.json`);
        let Response = await a.json();
        console.log(Response)
        let card = `<div class="card" data-folder=${data}>
            <div class="img">
              <img src="https://i.scdn.co/image/ab67616d00001e026404721c1943d5069f0805f3" alt="">
              <div><svg width="44" height="44" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="55" fill="#1ed760" />
                  <polygon points="50,40 85,60 50,80" fill="black" />
                </svg>
              </div>
            </div>
            <div class="detail">
              <div>${Response.title}</div>
              <div>${Response.description}</div>
            </div>
          </div>`
          document.querySelector(".songs").innerHTML = document.querySelector(".songs").innerHTML + card
      }
    }
  // Playlist load
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      currentAudio.pause()
      await getsong(`Songs/${item.currentTarget.dataset.folder}`)
      clickedMusic = document.querySelectorAll(".music")[0];
      if (!clickedMusic) return;

      clickedMusic.querySelector(".play img").src = "assets/images/pause.svg";
      playsong = songs[0];
      currentAudio = new Audio(playsong);
      currentlyPlaying = clickedMusic;
      document.querySelector(".playsong").innerText = clickedMusic.querySelector(".info > div").innerText;
      document.querySelector(".volume-slider").value = 1;
      currentAudio.volume = 1;
      currentAudio.play();
      play.src = "assets/images/pause.svg";

      timeupdate();
    })
  })

}


async function main() {
  let musicbox;
  let musicindex;

  displayAlbum()

  await getsong("Songs/YT_Studio Music")
  let playlist = document.querySelector(".Playlist")
  clickedMusic = document.querySelectorAll(".music")[0]
  musicbox = [...document.querySelectorAll(".music")];
  musicindex = musicbox.indexOf(clickedMusic)
  playsong = `${currentfolder}/` + clickedMusic.querySelector(".info").innerText.replace("\n", " - ")
  document.querySelector(".playsong").innerText = clickedMusic.querySelector(".info > div").innerText

  // auto select first music
  if (clickedMusic.querySelector(".play img").src.endsWith("play.svg")) {
    currentAudio = new Audio(playsong);
    currentlyPlaying = clickedMusic;
    currentAudio.volume = 1
    document.querySelector(".volume-slider").value = 1
    clickedMusic.querySelector(".play img").src = "assets/images/pause.svg";
    document.querySelector(".duration").innerText = `0:00 / 0:00`
  }
  timeupdate()

  // play Music 
  playlist.addEventListener("click", function (event) {
    clickedMusic = event.target.closest(".music");
    console.log(clickedMusic)
    musicbox = [...document.querySelectorAll(".music")];
    musicindex = musicbox.indexOf(clickedMusic)
    playsong = `${currentfolder}/` + clickedMusic.querySelector(".info").innerText.replace("\n", " - ")
    document.querySelector(".playsong").innerText = clickedMusic.querySelector(".info > div").innerText
    if (currentlyPlaying && currentlyPlaying !== clickedMusic) {
      currentlyPlaying.querySelector(".play img").src = "assets/images/play.svg";
      if (currentAudio) currentAudio.pause();
    }

    if (clickedMusic.querySelector(".play img").src.endsWith("play.svg")) {
      currentAudio = new Audio(playsong);
      currentlyPlaying = clickedMusic;
      document.querySelector(".volume-slider").value = 1
      currentAudio.play();
      clickedMusic.querySelector(".play img").src = "assets/images/pause.svg";
      play.src = "assets/images/pause.svg";

      currentAudio.addEventListener("ended", () => {
        clickedMusic.querySelector(".play img").src = "assets/images/play.svg";
        play.src = "assets/images/play.svg";
        currentlyPlaying = null;
        document.querySelector(".circle").style.left = "0%"
      });

    }
    else {
      clickedMusic.querySelector(".play img").src = "assets/images/play.svg";
      currentAudio.pause();
      play.src = "assets/images/play.svg"
    }
    timeupdate()
  });
  play.addEventListener("click", () => {
    if (currentAudio.paused) {
      currentAudio.play();
      play.src = "assets/images/pause.svg";
    }
    else {
      currentAudio.pause()
      play.src = "assets/images/play.svg";
    }
  });


  // hamburger menu for mobile
  document.getElementById("hamburger-menu").addEventListener("click", () => {
    document.querySelector(".left").classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    const sidebar = document.querySelector(".left");
    const hamburger = document.getElementById("hamburger-menu");
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // dot btn for tab
  document.querySelector(".dot-btn").addEventListener("click", () => {
    document.querySelector(".dot-btn .Support").classList.toggle("hidden");
    if (document.querySelector(".dot-btn button img").src.endsWith("dot.svg")) {
      document.querySelector(".dot-btn button img").src = "assets/images/cross.svg"
    }
    else {
      document.querySelector(".dot-btn button img").src = "assets/images/dot.svg"
    }
  });

  // previous btn
  let presong;
  previous.addEventListener("click", () => {
    let index = musicbox.indexOf(currentlyPlaying)
    if (index > 0) {
      currentlyPlaying.querySelector(".play img").src = "assets/images/play.svg";
      let filename = decodeURIComponent(songs[index - 1]).split("\\").pop()
      presong = `${currentfolder}/` + filename
      currentAudio.pause()
      currentAudio = new Audio(presong)
      currentAudio.play()
      timeupdate()
      document.querySelector(".playsong").innerText = filename.split(" - ")[0];
      play.src = "assets/images/pause.svg"
      musicindex = musicbox.indexOf(clickedMusic)
      clickedMusic = musicbox[musicindex - 1]
      currentlyPlaying = clickedMusic
      currentlyPlaying.querySelector(".play img").src = "assets/images/pause.svg";
      document.querySelector(".volume-slider").value = 1
    }
  });

  // next btn  
  let nextsong;
  next.addEventListener("click", () => {
    let index = musicbox.indexOf(currentlyPlaying)
    if (index + 1 < songs.length) {
      currentlyPlaying.querySelector(".play img").src = "assets/images/play.svg";
      let filename = decodeURIComponent(songs[index + 1]).split("\\").pop()
      nextsong = `${currentfolder}/` + filename
      currentAudio.pause()
      currentAudio = new Audio(nextsong)
      currentAudio.play()
      timeupdate()
      document.querySelector(".playsong").innerText = filename.split(" - ")[0];
      play.src = "assets/images/pause.svg"
      musicindex = musicbox.indexOf(clickedMusic)
      clickedMusic = musicbox[musicindex + 1]
      currentlyPlaying = clickedMusic
      currentlyPlaying.querySelector(".play img").src = "assets/images/pause.svg";
      document.querySelector(".volume-slider").value = 1
    }
  });

  // Volume btn
  document.querySelector(".volume-slider").addEventListener("input", e => {
    //  console.log(e , e.target , e.target.value)
    currentAudio.volume = parseFloat(e.target.value);
    if (currentAudio.volume === 0) {
      document.querySelector(".volume img").src = "assets/images/mute.svg"
    }
    else if (currentAudio.volume !== 0) {
      document.querySelector(".volume img").src = "assets/images/vol-on.svg"
    }
  })
  document.querySelector(".volume img").addEventListener("click", () => {
    if (currentAudio && document.querySelector(".volume-slider").value !== 0) {
      currentAudio.muted = !currentAudio.muted;
      if (currentAudio.muted) {
        document.querySelector(".volume img").src = "assets/images/mute.svg";
        document.querySelector(".volume-slider").value = 0
      }
      else {
        document.querySelector(".volume img").src = "assets/images/vol-on.svg";
        document.querySelector(".volume-slider").value = currentAudio.volume
      }
    }
  });

  
}

main()
