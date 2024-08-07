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
  const deleteButton = document.getElementById('remove-access__button')

  if (deleteButton) {
    deleteButton.addEventListener('click', handleDeleteButtonClick)
  }
}

function handleDeleteButtonClick() {
  const deleteButton = document.getElementById('remove-access__button')
  const userId = deleteButton.getAttribute('data-user-id')
  const clientId = deleteButton.getAttribute('data-client-id')
  const accessToken = deleteButton.getAttribute('data-access-token')

  if (!userId || !clientId || !accessToken) {
    console.error('User ID, Client ID or Access Token is missing.')
    return
  }

  const actionUrl = `/v1/users/${userId}/clients/${clientId}`
  console.log('Action URL:', actionUrl)

  fetch(actionUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
  })
    .then(response => {
      if (response.ok) {
        window.location.href = '/settings?success=true'
      } else {
        alert('Failed to remove access.')
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert('An error occurred while removing access.')
    })
}
