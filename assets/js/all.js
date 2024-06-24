document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card--clickable.toggle-sensitive')

  cards.forEach(card => {
    card.addEventListener('click', event => {
      event.preventDefault()

      const openSpan = card.querySelector('.open')
      const closedSpan = card.querySelector('.closed')
      const sensitiveDiv = card.querySelector('.sensitive')

      if (openSpan && closedSpan && sensitiveDiv) {
        openSpan.classList.toggle('hidden')
        closedSpan.classList.toggle('hidden')
        sensitiveDiv.classList.toggle('hidden')
      }
    })
  })
})
