import { ViewController } from "./viewController.js";

const perPageSelector = document.querySelector("#page-list")
const nextPageButton = document.querySelector("#next-page")
const previousPageButton = document.querySelector("#previous-page")
const tableView = document.querySelector("#table")

const viewController = ViewController()

function start() {
    viewController.setViewStateUpdatedListener(onViewStateUpdated)
    viewController.fetchData()

    initPageArrows()
    initPerPageSelector()
}

function initPageArrows() {
    nextPageButton.addEventListener("click", viewController.onNextPageClicked)
    previousPageButton.addEventListener("click", viewController.onPreviousPageClicked)
}

function initPerPageSelector() {
    perPageSelector.addEventListener("change", evt => {
        viewController.onPaginationValueChanged(+evt.target.value)
    })
}

function onViewStateUpdated(state) {
    updatePerPageSelector(state.perPageList, state.perPage)
    updatePageArrows(state.page, state.pages)
    updateTable(state.headers, state.data)
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

function updatePageArrows(page, maxPages) {
    previousPageButton.disabled = page === 0
    nextPageButton.disabled = page === maxPages
}

function updateTable(headers, data) {
    function createHeaderRow() {
        const el = document.createElement("thead")

        headers.forEach(header => {
            const th = document.createElement("th")
            th.innerText = header
            el.appendChild(th)
        })

        return el
    }

    function createRow(company) {
        const el = document.createElement("tr")

        headers.forEach(header => {
            const td = document.createElement("td")
            td.innerText = company[header]
            el.appendChild(td)
        })

        return el
    }

    tableView.innerHTML = ""

    tableView.appendChild(createHeaderRow())
    data.forEach(company => {
        tableView.appendChild(createRow(company))
    })
}

start()