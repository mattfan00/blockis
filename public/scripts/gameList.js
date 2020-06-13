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


window.onload = () => {
  currVisibleId = ""
  const rows = document.querySelectorAll('.row-form')
  let rowIds = []
  for (let i = 0; i < rows.length; i++) {
    rowIds.push(rows[i].id)
  }

  for (var i = 0; i < rows.length; i++) {
    rows[i].addEventListener("click", function (e) {
      if (currVisibleId === e.currentTarget.id && e.target.parentNode.className === "row") {
        document.getElementById(currVisibleId).removeChild(document.querySelector(".enter-row"))
        currVisibleId = ""
      } else if (currVisibleId !== e.currentTarget.id) {
        currVisibleId = e.currentTarget.id

        // set all the rows that arent the newly selected one to hidden
        rowIds.forEach(rowId => {
          if (currVisibleId !== rowId && document.querySelector(".enter-row")) {
            document.getElementById(rowId).removeChild(document.querySelector(".enter-row"))
          }
        })

        let row = document.getElementById(currVisibleId)

        let inputSection = document.createElement('div')
        inputSection.className = "enter-row"
        
        inputSection.innerHTML =`
          <input name="username" placeholder="Enter nickname..." class="nickname">
          <input name="roomId" class="hide" value="${currVisibleId}">
          <button type="submit" id="play"><h2>join</h2></button>
        `
        row.appendChild(inputSection)

        let nickname = localStorage.getItem("nickname")
        let input = document.querySelector(".nickname")

        if (!nickname) {
          document.getElementById("play").classList.add("disable")
        } else {
          input.value = nickname
        }
        
        input.focus()
      }
    })
  }
}

window.addEventListener('click', (e) => {
  let visibleRow = document.getElementById(currVisibleId)
  
  if (!visibleRow.contains(e.target)) {
    visibleRow.removeChild(document.querySelector(".enter-row"))
    currVisibleId = ""
  } 
})

// async function handlePassword(e, roomId) {
//   e.preventDefault()
//   let input = document.querySelector(".password-input")
//   let submittedPassword = input.value
  
//   let correctPassword = await fetch("/api/game/" + roomId)
//     .then(res => res.json())
//     .then(data => data.password)

//   if (submittedPassword === correctPassword) {
//     window.location="/game/" + roomId
//   } else {
//     console.log('password incorrect')
//     input.select()
//     input.classList.add("password-incorrect")
//   }
// }

function removeOutline(input) {
  input.classList.remove("password-incorrect")
}


