import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

govukFrontend.initAll()
mojFrontend.initAll()

document.addEventListener('DOMContentLoaded', () => {
  initCardClickHandlers()
})

function initCardClickHandlers() {
  const cards = document.querySelectorAll('.card--clickable.toggle-sensitive')
  cards.forEach(card => card.addEventListener('click', handleCardClick))
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

function initCloseTabs(tabTuples) {
  tabTuples.forEach(([toggle, menu]) => {
    if (menu) {
      menu.setAttribute('hidden', 'hidden')
      if (toggle) {
        toggle.classList.remove(tabOpenClass)
        toggle.parentElement.classList.remove('item-open')
        toggle.setAttribute('aria-expanded', 'false')
      }
    }
  })
}

function toggleMenu(toggle, menu) {
  if (menu) {
    const isOpen = !menu.hasAttribute('hidden')

    if (isOpen) {
      initCloseTabs([[toggle, menu]])
    } else {
      menu.removeAttribute('hidden')
      toggle.classList.add(tabOpenClass)
      toggle.parentElement.classList.add('item-open')
      toggle.setAttribute('aria-expanded', 'true')
    }
  }
}

const tabOpenClass = 'launchpad-home-header__toggle-open'
