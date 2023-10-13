import React, {useState} from "react"
import ScenarioTable from "./ScenarioTable";
import ScenarioScreen from "./ScenarioScreen";
import Button from '@atlaskit/button';

const ScenarioTab = ({access}: { access: number }) => {
    const [screen, setScreen] = useState(true)

    return (
        <>
            {screen ? <ScenarioScreen/> : <><ScenarioTable/><Button onClick={() => setScreen(true)} >Создать сценарий</Button ></>}
        </>
    )
}

export default ScenarioTab