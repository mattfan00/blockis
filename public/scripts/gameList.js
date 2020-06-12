window.onload = () => {
  let currVisibleId = ""

  const privateRows = document.querySelectorAll('.private-row')
  let privateRowIds = []
  for (let i = 0; i < privateRows.length; i++) {
    privateRowIds.push(privateRows[i].id)
  }
  const privateCols = document.querySelectorAll('.private-col')

  for (var i = 0; i < privateRows.length; i++) {
    privateRows[i].addEventListener("click", function (e) {
      if (currVisibleId !== e.currentTarget.id) {
        currVisibleId = e.currentTarget.id

        // set all the rows that arent the newly selected one to hidden
        privateRowIds.forEach(rowId => {
          if (currVisibleId !== rowId) {
            document.getElementById("password-" + rowId).innerHTML = "Private"
          }
        })
        let passwordSection = document.getElementById('password-' + currVisibleId)

        passwordSection.innerHTML =`
          <form onSubmit="handlePassword(event, '${currVisibleId}')">
            <input class="password-input" type="password" placeholder="Enter password..." name="password" onkeypress="removeOutline(this)"> 
          </form>
        ` 
      }
      
    })
  }

  window.addEventListener('click', (e) => {
    let visiblePrivateRow = document.getElementById(currVisibleId)
    
    if (!visiblePrivateRow.contains(e.target)) {
      // console.log('this is making it private')
      document.getElementById("password-" + currVisibleId).innerHTML = "Private"
      currVisibleId = ""
    }
    
  })
}

async function handlePassword(e, roomId) {
  e.preventDefault()
  let input = document.querySelector(".password-input")
  let submittedPassword = input.value
  
  let correctPassword = await fetch("/api/game/" + roomId)
    .then(res => res.json())
    .then(data => data.password)

  if (submittedPassword === correctPassword) {
    window.location="/game/" + roomId
  } else {
    console.log('password incorrect')
    input.select()
    input.classList.add("password-incorrect")
  }
}

function removeOutline(input) {
  input.classList.remove("password-incorrect")
}


