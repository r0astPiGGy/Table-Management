import { ITEMS_PER_PAGE } from "./Model.js";

function viewStateOf(data = []) {
    return {
        data: data,
        headers: [],
        page: 0,
        pages: 0,
        perPage: 0,
        perPageList: ITEMS_PER_PAGE
    }
}

export const ViewModel = function() {

    let viewState = null
    let viewStateUpdatedListener = null

    function setViewStateUpdatedListener(listener) {
        viewStateUpdatedListener = listener
    }

    function fireViewStateUpdatedEvent() {
        if (viewStateUpdatedListener === null) return

        viewStateUpdatedListener(viewState)
    }

    function fetchData() {

    }

    function onHeaderClicked(headerId) {

    }

    function onNextPageClicked() {

    }

    function onPreviousPageClicked() {

    }

    function onPaginationValueChanged(value) {

    }

    return {
        setViewStateUpdatedListener: setViewStateUpdatedListener,
        fetchData: fetchData,
        onHeaderClicked: onHeaderClicked,
        onNextPageClicked: onNextPageClicked,
        onPreviousPageClicked: onPreviousPageClicked,
        onPaginationValueChanged: onPaginationValueChanged,
    }
}