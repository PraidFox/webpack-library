import React, {useEffect, useState} from "react"
import {Components, Tools} from "@praidfox/tst-library";
import TablePlanAction from "../Tables/TablePlanAction";
import FormAddAction from "../Forms/FormAddAction";
import {ModalDefault} from "../Default/ModalDefault";
import {Action, ScreenAction} from "../../tools/interfaces";
import SectionMessage from "@atlaskit/section-message";

const issue = Tools.Utils.BaseUtils.getCurrentIssueId()
const ScenarioScreenBottom = () => {

    const [optionFiledRto, setOptionFiledRto] = useState<Tools.Interface.OptionsModal.RenderOptionsSelect[]>([])
    const [optionFiledPercentage, setOptionFiledPercentage] = useState<Tools.Interface.OptionsModal.RenderOptionsSelect[]>([])
    const [dataTable, setDataTable] = useState({})


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


    const getType = (value:string) : string => {
        if(value == "group"){
            return "issue"
        } else if(value == "workers"){
            return "issue"
        }
        return value
    }
    const handler = (data : ScreenAction) => {

        const valid = validateDate(data)

        if(valid.length > 0){
            return <SectionMessage title={`Необходимо заполнить ${valid.length == 1 ? "поле" : "поля"}`} appearance="warning">
                {valid.map(val => <li>{val}</li>)}
            </SectionMessage>

        } else {
            let dataAction: Action = {
                sequence: data.sequence,
                assignee: {id: data[data.typeWhoAction].value, type: getType(data.typeWhoAction), name: data[data.typeWhoAction].label},
                description: data.stepDescription,
                duration: data.duration,
                actionType: "action"
            }
            setDataTable(r => {...r, actions: [...r.actions, dataAction]})

            return ''
        }
    }

    const validateDate = (data: ScreenAction) => {
        let required:string[] = []
        if(!data.sequence){
            required.push("Порядковый номер")
        }
        if(!data.group && !data.position && !data.role && !data.workers){
            required.push("Исполнитель")
        }

        if(!data.stepDescription){
            required.push("Описание шага")
        }
        if(!data.duration){
            required.push("Время на исполнение, мин")
        }

        return required
    }

    const setSupportTime =(e) => {
        console.log(e)
    }
    const setCompletionPercentage =(e) => {
        console.log(e)
    }

    return <>
        <hr/>
        <h4>Прогноз исполнения процесса/функции в таком формате</h4>
        <Components.Fields.FieldSelect id={"supportTime"} placeholder={""} title={"Сколько времени вы можете поддерживать?"} options={optionFiledRto} setFunction={setSupportTime}/>
        <Components.Fields.FieldSelect id={"completionPercentage"} placeholder={""} title={"Процент исполнения"} options={optionFiledPercentage} setFunction={setCompletionPercentage}/>
        <TablePlanAction data={data.actions}/>
        <ModalDefault title={"Добавление действия"} handler={handler}>
            <FormAddAction sequence={dataTable.length + 1}/>
        </ModalDefault>
    </>
}

export default ScenarioScreenBottom