import React from "react";
import ReactDOM from "react-dom";
import ScenarioTable from "./App/ScenarioTab";

function run(type, userAccess) {

    const fixPosition = (element, component) => {
        element.closest(".wrap").children[0].style.display = "none"
        element.closest(".wrap").children[1].style.width = "100%"
        element.closest(".wrap").style.paddingLeft = "0"
        ReactDOM.render(component , element)
    }
    if (type === "ALL") {
        ReactDOM.render(
            <React.StrictMode>
                <ScenarioTable access={userAccess}/>
            </React.StrictMode>,
            document.getElementById("scenario-bcp-table")
        );
    } else {
        fixPosition(document.getElementById(type), <ScenarioTable access={userAccess}/>)
    }
}


if (LOCAL) {

    run("ALL", 200)
}

export function access(type) {
    // BcmTeamApi.userAccess(Utils.getCurrentIssueId()).then(response => run(type, response.status))
    //     .catch(() => run(type, 403));

    if (type !== "linked-process-block") {
        //handlerTeam()
    }
}







