import * as govukFrontend from '/assets/govuk/govuk-frontend.min.js'
import * as mojFrontend from '/assets/moj/moj-frontend.min.js'

govukFrontend.initAll()
mojFrontend.initAll()

document.addEventListener('DOMContentLoaded', () => {
  initCardClickHandlers()
  initDeleteButtonHandler()
  initHeader()
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

function initDeleteButtonHandler() {
  const yesButton = document.getElementById('remove-access__button-yes')
  const noButton = document.getElementById('remove-access__button-no')
  const actionInput = document.getElementById('action-input')

  if (yesButton) {
    yesButton.addEventListener('click', () => (actionInput.value = 'remove'))
  }

  if (noButton) {
    noButton.addEventListener('click', () => (actionInput.value = 'cancel'))
  }
}

function initHeader() {
  const userToggle = document.querySelector('.launchpad-home-header__user-menu-toggle')
  const userMenu = document.getElementById('launchpad-home-header-user-menu')

  if (userToggle && userMenu) {
    userToggle.removeAttribute('hidden')

    initCloseTabs([[userToggle, userMenu]])

    userToggle.addEventListener('click', () => toggleMenu(userToggle, userMenu))
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
