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
        
        let input = document.createElement('input')
        input.className = 'password-input'
        input.type = 'password'
        input.placeholder = 'Enter password...'
        passwordSection.innerHTML = ''
        passwordSection.appendChild(input)
        input.focus()
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

  // for (var i = 0; i < privateRows.length; i++) {
  //   privateRows[i].addEventListener("click", function (e) {
  //       // if (inputVisible === "" || privateRowIds.includes(e.currentTarget.id)) {
  //       //   console.log(inputVisible)
  //       //   console.log(e.currentTarget.id)
  //       //   if (privateRowIds.includes(e.currentTarget.id) && inputVisible !== "" && inputVisible !== e.currentTarget.id) {
  //       //     let visiblePrivateRow = document.getElementById(inputVisible)
  //       //     document.getElementById("password-" + inputVisible).innerHTML = "Private"
  //       //   }
  //       //   inputVisible = e.currentTarget.id
  //       //   let id = e.currentTarget.id
  //       //   let passwordSection = document.getElementById('password-' + id)
          
  //       //   let input = document.createElement('input')
  //       //   input.className = 'password-input'
  //       //   input.type = 'password'
  //       //   input.placeholder = 'Enter password...'
  //       //   passwordSection.innerHTML = ''
  //       //   passwordSection.appendChild(input)
  //       // }
  //       if (privateRowIds.includes(e.currentTarget.id)) {
  //         // this means an input was already displayed so we should clear it 
  //         if (inputVisible !== "" && inputVisible !== e.currentTarget.id) {
  //           console.log('went to private')
  //           let visiblePrivateRow = document.getElementById(inputVisible)
  //           document.getElementById("password-" + inputVisible).innerHTML = "Private"
  //         } 
  //         inputVisible = e.currentTarget.id
  //         let id = e.currentTarget.id
  //         let passwordSection = document.getElementById('password-' + id)
          
  //         let input = document.createElement('input')
  //         input.className = 'password-input'
  //         input.type = 'password'
  //         input.placeholder = 'Enter password...'
  //         passwordSection.innerHTML = ''
  //         passwordSection.appendChild(input)
  //       }
  //   });
  // }
}
