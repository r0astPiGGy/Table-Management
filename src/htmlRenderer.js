import {ViewController} from "./viewController.js";
import {tryRoundNumber} from "./utils.js";

const perPageSelector = document.querySelector("#page-list")
const nextPageButton = document.querySelector("#next-page")
const previousPageButton = document.querySelector("#previous-page")
const tableView = document.querySelector("#table")
const searchView = document.querySelector("#search-bar")

const viewController = ViewController()

function start() {
    viewController.setViewStateUpdatedListener(onViewStateUpdated)
    viewController.fetchData()

    initPageButtons()
    initPerPageSelector()
    initSearchView()
}

function initPageButtons() {
    nextPageButton.addEventListener("click", viewController.onNextPageClicked)
    previousPageButton.addEventListener("click", viewController.onPreviousPageClicked)
}

function initPerPageSelector() {
    perPageSelector.addEventListener("change", evt => {
        viewController.onPaginationValueChanged(+evt.target.value)
    })
}

function initSearchView() {
    searchView.addEventListener("change", evt => {
        viewController.onNameFilterValueChanged(evt.target.value)
    })
}

function onViewStateUpdated(state) {
    updatePerPageSelector(state.perPageList, state.perPage)
    updatePageButtons(state.page, state.pages)
    updateTable(state)
    updateSearchView(state.searchQuery)
}

function updatePerPageSelector(perPageList, selected) {
    perPageSelector.innerHTML = ""

    function createOption(perPage) {
        const el = document.createElement("option")
        el.value = perPage
        el.innerText = perPage
        return el
    }

    perPageList
        .map(perPage => createOption(perPage))
        .forEach(element => perPageSelector.appendChild(element))

    perPageSelector.value = selected
}

function updatePageButtons(page, maxPages) {
    setEnabled(previousPageButton, page !== 0)
    setEnabled(nextPageButton, page !== maxPages)
}

function setEnabled(element, enable) {
    if (enable) {
        if (element.classList.contains("disabled")) {
            element.classList.remove("disabled")
        }
    } else {
        if (!element.classList.contains("disabled")) {
            element.classList.add("disabled")
        }
    }
}

function createHeader(headerId, state) {
    const th = document.createElement("th")

    const thRow = document.createElement("div")
    thRow.className = "header-row"

    const textEl = document.createElement("p")
    textEl.textContent = headerId
    thRow.appendChild(textEl)

    if (state.headerIdToSortBy === headerId) {
        const sortIndicatorEl = document.createElement("i")

        sortIndicatorEl.classList.add("sort-indicator")
        sortIndicatorEl.classList.add(state.sortMode)

        thRow.appendChild(sortIndicatorEl)
    }

    th.appendChild(thRow)
    th.addEventListener("click", () => {
        viewController.onHeaderClicked(headerId)
    })

    return th
}

function updateTable(state) {
    function createHeaderRow() {
        const el = document.createElement("thead")

        state.headers.forEach(header => {
            el.appendChild(createHeader(header, state))
        })

        return el
    }

    function createRow(company) {
        const el = document.createElement("tr")

        state.headers.forEach(header => {
            const td = document.createElement("td")
            td.innerText = tryRoundNumber(company[header])
            el.appendChild(td)
        })

        return el
    }

    const tbody = document.createElement("tbody")

    tableView.innerHTML = ""
    tableView.appendChild(createHeaderRow())

    state.data.forEach(company => {
        tbody.appendChild(createRow(company))
    })

    tableView.appendChild(tbody)
}

function updateSearchView(searchQuery) {
    searchView.value = searchQuery
}

start()
