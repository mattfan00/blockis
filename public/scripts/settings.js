window.onload = () => {
  if (localStorage.getItem("left"))
    document.getElementById("left").innerHTML = JSON.parse(localStorage.getItem("left")).keyChar
  if (localStorage.getItem("right"))
    document.getElementById("right").innerHTML = JSON.parse(localStorage.getItem("right")).keyChar
  if (localStorage.getItem("down"))
    document.getElementById("down").innerHTML = JSON.parse(localStorage.getItem("down")).keyChar
  if (localStorage.getItem("drop"))
    document.getElementById("drop").innerHTML = JSON.parse(localStorage.getItem("drop")).keyChar
  if (localStorage.getItem("rotate"))
    document.getElementById("rotate").innerHTML = JSON.parse(localStorage.getItem("rotate")).keyChar
  if (localStorage.getItem("hold"))
    document.getElementById("hold").innerHTML = JSON.parse(localStorage.getItem("hold")).keyChar
}

let changing = null 
let funcBind

document.addEventListener("click", (e) => {
  if (changing) {
    if (!document.getElementById(changing).contains(e.target)) {
      document.removeEventListener("keydown", funcBind)
      document.getElementById(changing).classList.remove("selected")
      changing = null
    }
  }
})

function changeBind(e) {
  if (!changing) {
    changing = e.target.id
    e.target.classList.add("selected")

    funcBind = handleChange.bind(this, e.target)
    document.addEventListener('keydown', funcBind);
  }
  if (changing && (changing != e.target.id)) {
    document.getElementById(changing).classList.remove("selected")
    changing = e.target.id
    e.target.classList.add("selected")
    document.removeEventListener("keydown", funcBind)

    funcBind = handleChange.bind(this, e.target)
    document.addEventListener('keydown', funcBind);
  }
}

function handleChange(controlSlot, e) {
  let keyChar = e.key
  let keyCode = e.keyCode

  // console.log(e)
  // console.log(controlSlot)

  
  if (keyCode == 37) // left icon
    keyChar = '&larr;'
  else if (keyCode == 39) // right icon
    keyChar = '&rarr;'
  else if (keyCode == 40) // down icon
    keyChar = '&darr;'
  else if (keyCode == 32) // spacebar icon
    keyChar = '&blank;'
  else if (keyCode == 38) // up icon
    keyChar = '&uarr;'

  controlSlot.innerHTML = keyChar
  localStorage.setItem(controlSlot.id, JSON.stringify({
    keyChar,
    keyCode
  }))

  changing = null 
  controlSlot.classList.remove("selected")
  document.removeEventListener('keydown', funcBind)
}

function resetDefaults() {
  localStorage.removeItem("left")
  localStorage.removeItem("right")
  localStorage.removeItem("down")
  localStorage.removeItem("drop")
  localStorage.removeItem("rotate")
  localStorage.removeItem("hold")

  document.getElementById("left").innerHTML = "&larr;"
  document.getElementById("right").innerHTML = "&rarr;"
  document.getElementById("down").innerHTML = "&darr;"
  document.getElementById("drop").innerHTML = "&blank;"
  document.getElementById("rotate").innerHTML = "&uarr;"
  document.getElementById("hold").innerHTML = "c"
  
}