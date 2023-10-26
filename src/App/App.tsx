import React, {useEffect, useState} from "react"
import ScenarioTable from "./Screens/ScenarioTable";
import ScenarioScreenTop from "./Screens/ScenarioScreenTop";
import Button from '@atlaskit/button';
import ScenarioScreenBottom from "./Screens/ScenarioScreenBottom";
import {Tools} from "@praidfox/tst-library";


const App = ({access}: { access: number }) => {
    const [screen, setScreen] = useState(true)
    const [data, setData] = useState()



    const createDataToPost = (value, type) => {
        console.log(value)
    }

    useEffect(() => {
        Tools.Api.PluginScenarioApi.getScenario(Tools.Utils.BaseUtils.getCurrentIssueId()).then(r => setData(r.data))
    }, []);

    return (
        <>
            {screen ?
                <>
                    <ScenarioScreenTop data={data} setFunction={createDataToPost}/>
                    <ScenarioScreenBottom data={data} setFunction={createDataToPost}/>
                    <br/>
                    <div style={{textAlign: "end"}}>
                        <Button onClick={() => setScreen(false)}>Добавить</Button>
                         <>           </>
                        <Button onClick={() => setScreen(false)}>Отмена</Button>
                    </div>

                </> :
                <>
                    <ScenarioTable/>
                    <Button onClick={() => setScreen(true)}>Создать сценарий</Button>
                </>}
        </>
    )
}

export default App