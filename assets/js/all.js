document.addEventListener('DOMContentLoaded', () => {
  initializeCardClickHandlers()
  initializeDeleteButtonHandler()
})

// Initialize click handlers for cards
function initializeCardClickHandlers() {
  const cards = document.querySelectorAll('.card--clickable.toggle-sensitive')
  cards.forEach(card => {
    card.addEventListener('click', handleCardClick)
  })
}

// Handle card click events
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

// Initialize click handler for the delete button
function initializeDeleteButtonHandler() {
  const deleteButton = document.getElementById('delete-access-button')

  if (deleteButton) {
    deleteButton.addEventListener('click', handleDeleteButtonClick)
  }
}

// Handle delete button click events
function handleDeleteButtonClick() {
  const dataContainer = document.getElementById('data-container')
  const userId = dataContainer?.getAttribute('data-user-id')
  const clientId = dataContainer?.getAttribute('data-client-id')

  if (!userId || !clientId) {
    console.error('User ID or Client ID is missing.')
    return
  }

  console.log('User ID:', userId)
  console.log('Client ID:', clientId)

  const actionUrl = `/v1/users/${userId}/clients/${clientId}`
  console.log('Action URL:', actionUrl)

  fetch(actionUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
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
