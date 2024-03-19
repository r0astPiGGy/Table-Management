import { ViewController } from "./viewController.js";

const viewController = ViewController()

function start() {
    viewController.setViewStateUpdatedListener(onViewStateUpdated)
    viewController.fetchData()
}

function onViewStateUpdated(state) {

}

start()