import { ViewModel } from "./ViewModel.js";

const viewModel = ViewModel()

function start() {
    viewModel.setViewStateUpdatedListener(onViewStateUpdated)
    viewModel.fetchData()
}

function onViewStateUpdated(state) {

}

start()