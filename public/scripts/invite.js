window.onload = () => {
  let nickname = localStorage.getItem("nickname")
  if (!nickname) {
    document.getElementById("play").classList.add("disable")
  } else {
    console.log(nickname)
    document.querySelector(".nickname").value = nickname
  }
}

function handlePlay() {
  let nickname = document.querySelector(".nickname").value
  let playButton = document.getElementById("play")
  if (nickname === "") {
    playButton.classList.add("disable")
  } else {
    playButton.classList.remove("disable")
  }
}

function handleSubmit() {
  let nickname = document.querySelector(".nickname").value
  localStorage.setItem("nickname", nickname)
}