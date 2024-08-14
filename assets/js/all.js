document.addEventListener('DOMContentLoaded', () => {
  initializeCardClickHandlers()
  initializeDeleteButtonHandler()
})

function initializeCardClickHandlers() {
  const cards = document.querySelectorAll('.card--clickable.toggle-sensitive')
  cards.forEach(card => {
    card.addEventListener('click', handleCardClick)
  })
}

function handleCardClick(event) {
  event.preventDefault()

  const card = event.currentTarget
  const openSpan = card.querySelector('.open')
  const closedSpan = card.querySelector('.closed')
  const sensitiveDiv = card.querySelector('.sensitive')

  if (openSpan && closedSpan && sensitiveDiv) {
    openSpan.classList.toggle('hidden')
    closedSpan.classList.toggle('hidden')
    sensitiveDiv.classList.toggle('hidden')
  }
}

function initializeDeleteButtonHandler() {
  const yesButton = document.getElementById('remove-access__button-yes')
  const noButton = document.getElementById('remove-access__button-no')
  const actionInput = document.getElementById('action-input')

  if (yesButton) {
    yesButton.addEventListener('click', () => {
      actionInput.value = 'remove'
    })
  }

  if (noButton) {
    noButton.addEventListener('click', () => {
      actionInput.value = 'cancel'
    })
  }
}
