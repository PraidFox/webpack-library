import React, {useEffect, useState} from "react"
import {Components, Tools} from "@praidfox/tst-library";

const issue = Tools.Utils.BaseUtils.getCurrentIssueId()
const PlanAction = () => {

    const [optionFiledRto, setOptionFiledRto] = useState<Tools.Interface.OptionsModal.RenderOptionsSelect[]>([])
    const [optionFiledPercentage, setOptionFiledPercentage] = useState<Tools.Interface.OptionsModal.RenderOptionsSelect[]>([])
    
    const FieldsId = Tools.Storage.FieldsId
    useEffect(() => {
        const controller = new AbortController();

        Tools.Api.PluginTeamApi.getFieldOptions(FieldsId.RTO, issue, controller.signal).then(r => {
            setOptionFiledRto(Tools.Utils.RenderOptions.selectOptions(r.data))
        })
        Tools.Api.PluginTeamApi.getFieldOptions(FieldsId.PERCENTAGE_FIELD, undefined, controller.signal).then(r => {
            setOptionFiledPercentage(Tools.Utils.RenderOptions.selectOptions(r.data))
        })

        return () => {
            controller.abort()
        }
    }, []);

    console.log("Меня вызвали")


    return <>
        <h2>Прогноз исполнения процесса/функции в таком формате</h2>
        <Components.Fields.FieldSelect id={"supportTime"} placeholder={""} title={"Сколько времени вы можете поддерживать?"} options={optionFiledRto}/>
        <Components.Fields.FieldSelect id={"completionPercentage"} placeholder={""} title={"Процент исполнения"} options={optionFiledPercentage}/>

    </>
}

export default PlanAction