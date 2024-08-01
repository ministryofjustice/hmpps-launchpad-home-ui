document.addEventListener('DOMContentLoaded', () => {
  initHeader()
  initCardToggle()
})

const tabOpenClass = 'launchpad-home-header__toggle-open'

function initHeader() {
  const userToggle = document.querySelector('.launchpad-home-header__user-menu-toggle')
  const userMenu = document.getElementById('launchpad-home-header-user-menu')

  if (userToggle && userMenu) {
    userToggle.removeAttribute('hidden')

    closeTabs([[userToggle, userMenu]])

    userToggle.addEventListener('click', () => {
      toggleMenu(userToggle, userMenu)
    })
  }
}

function closeTabs(tabTuples) {
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
      closeTabs([[toggle, menu]])
    } else {
      menu.removeAttribute('hidden')
      toggle.classList.add(tabOpenClass)
      toggle.parentElement.classList.add('item-open')
      toggle.setAttribute('aria-expanded', 'true')
    }
  }
}

function initCardToggle() {
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
}
