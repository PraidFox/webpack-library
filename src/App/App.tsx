import React, {useState} from "react"
import ScenarioTable from "./Screens/ScenarioTable";
import ScenarioScreenTop from "./Screens/ScenarioScreenTop";
import Button from '@atlaskit/button';
import ScenarioScreenBottom from "./Screens/ScenarioScreenBottom";

const App = ({access}: { access: number }) => {
    const [screen, setScreen] = useState(true)

    return (
        <>
            {screen ?
                <>
                    <ScenarioScreenTop/>
                    <ScenarioScreenBottom/>
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