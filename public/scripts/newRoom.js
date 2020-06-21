function togglePrivate(e) {
  e.preventDefault()
  let privateInput = document.getElementById("private")
  privateInput.checked = !privateInput.checked
  document.getElementById("private-btn").classList.toggle("selected")
}
