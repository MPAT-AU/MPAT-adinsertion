export function highlightNavigation(routeFrom,routTo) {
    let navElems = document.querySelectorAll("a[href='admin.php?page=" + routeFrom + "']")
    let navElem = getNavElem(navElems)
    currentRemove(navElem)
    navElems = document.querySelectorAll("a[href='admin.php?page=" + routTo + "']")
    navElem = getNavElem(navElems)
    currentAdd(navElem)
}

function getNavElem(elems) {
    for (let i = 0; i < elems.length; i++) {
        if (!elems[i].classList.contains('menu-top')) {
            return elems[i]
        }
    }
}

function currentRemove(elem) {
    elem.classList.remove('current')
    elem.removeAttribute('aria-current')
    elem.parentElement.classList.remove('current')
}

function currentAdd(elem) {
    elem.classList.add('current')
    elem.setAttribute('aria-current', 'page')
    elem.parentElement.classList.add('current')
}