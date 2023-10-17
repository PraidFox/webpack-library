import React, {ChangeEvent, useEffect, useReducer, useState} from "react"

import {Components, Tools} from "@praidfox/tst-library";
import {OptionPropType, OptionsPropType} from '@atlaskit/radio/types';
import {RadioGroup} from '@atlaskit/radio';
import FormDefault from "./FormDefault";
import {Field} from "@atlaskit/form";
import {scenarioTypeForLocation, scenarioTypeForSystem} from "./tools/utils";
import Spinner from '@atlaskit/spinner';
import * as events from "events";

const optionsSubmissionRequired: OptionsPropType = [
    {name: 'submissionRequired', value: 'inStock', label: 'Есть в наличии'},
    {name: 'submissionRequired', value: 'mustProvided', label: 'Необходимо предоставить'},
];

interface FieldInScenarioScreen {
    processInBCP: Tools.Interface.OptionsModal.RenderOptionsIssue[],
    typeLostResource: OptionPropType[],
    systemsInProcess: Tools.Interface.OptionsModal.RenderOptionsIssue[],
    scenarioType: Tools.Interface.OptionsModal.RenderOptionsIssue[],
    scenarioAction: OptionPropType[],
    typeWorkplace: OptionPropType[],
}



interface Action {
    type: "addProcess"|"typeLostResource"|"addLostSystems"|"typeScenario"|"typeAction"|"alternativeDepartment"|"alternativePartner"|"alternativePSystems"|"typeWorkplace"|"needProvide"|"transitionWorkPlace",
    playLoad?: any
}
interface ValuesFields {
    process: string
    typeLostResource: string,
    typeScenario:  string,
    lostSystems: Tools.Interface.OptionsModal.RenderOptionsIssue[],
    typeAction: string,
    alternativeDepartment: any,
    alternativePartner: any,
    alternativePSystems: any,
    typeWorkplace: any,
    needProvide: any,
    transitionWorkPlace: any,
}
const reducer = (state:ValuesFields, action:Action):ValuesFields => {
    console.log(action)
switch (action.type) {
    case "addProcess": return {
        ...state, process: action.playLoad.value
    }
    case "typeLostResource": return {
        ...state, typeLostResource: action.playLoad
    }
    case "addLostSystems": return {
        ...state, lostSystems: action.playLoad
    }
    case "typeScenario": return {
        ...state, typeScenario: action.playLoad.value
    }
    case 'typeAction': return {
        ...state, typeAction: action.playLoad
    }

    default: return state
}

}


const issue = Tools.Utils.BaseUtils.getCurrentIssueId()
const ScenarioScreen = () => {

    const [optionsFields, setOptionsFields] = useState({} as FieldInScenarioScreen)
    const [valuesFields, setValuesFields] = useReducer(reducer, {} as ValuesFields)
    const [finishLoad, setFinishLoad] = useState<boolean>(false)

    const [submissionRequired, setSubmissionRequired] = useState<string>()

    const [typeActionValue, setTypeActionValue] = useState<string>()

    useEffect(() => {
        const controller = new AbortController();

        const p0 = Tools.Api.JiraApi.getIssue(issue, `${Tools.Storage.FieldsId.PROCESSES_MULTIPICKER}`, controller.signal)
        const p1 = Tools.Api.PluginTeamApi.getFieldOptions(Tools.Storage.FieldsId.PHYSICAL_OFFICE_LOS_SCENARIO, issue, controller.signal)
        const p2 = Tools.Api.PluginTeamApi.getFieldOptions(Tools.Storage.FieldsId.PHYSICAL_OFFICE_WORKPLACE_TYPE, issue, controller.signal)
        const p3 = Tools.Api.PluginTeamApi.getFieldOptions(Tools.Storage.FieldsId.TYPE_ACTIONS, issue, controller.signal)
        const p4 = Tools.Api.PluginTeamApi.getFieldOptions(13711, issue, controller.signal)


        Promise.all([p0, p1, p2, p3, p4]).then(r => {

            let newFieldsOptions = JSON.parse(JSON.stringify(optionsFields))
            const processInBCP: Tools.Interface.BaseModel.Issue[] = r[0].data.fields[Tools.Utils.BaseUtils.getFieldNameForJql(Tools.Storage.FieldsId.PROCESSES_MULTIPICKER)]

            newFieldsOptions['processInBCP'] = processInBCP.map(issue => ({
                label: issue.fields.summary,
                value: issue.id
            }))

            const scenarioType: Tools.Interface.BaseModel.Option[] = r[1].data
            newFieldsOptions["scenarioType"] = scenarioType.map(option => ({label: option.value, value: option.id}))

            const typeWorkplace: Tools.Interface.BaseModel.Option[] = r[2].data
            newFieldsOptions['typeWorkplace'] = typeWorkplace.map(option => ({
                label: option.value,
                value: option.id.toString(),
                name: "typeWorkplace"
            }))

            const scenarioAction: Tools.Interface.BaseModel.Option[] = r[3].data
            newFieldsOptions["scenarioAction"] = scenarioAction.map(option => ({
                label: option.value,
                value: option.id.toString(),
                name: "scenarioAction"
            }))

            const typeLostResource: Tools.Interface.BaseModel.Option[] = r[4].data
            newFieldsOptions["typeLostResource"] = typeLostResource.map(option => ({
                label: option.value,
                value: option.id.toString(),
                name: "typeLostResource"
            }))


            Tools.Api.PluginResourceApi.getAllResourceInProcess(processInBCP.map(issue => issue.id))
                .then(r => {
                        const resources: Tools.Interface.DtoModal.ResourceInfoDTO[] = r.data
                        newFieldsOptions['systemsInProcess'] = resources.filter(res => res.resourceType == "ItSystem").map(resource => ({
                            label: resource.resourceIssue.summary,
                            value: resource.resourceIssue.id
                        }))

                    setOptionsFields(newFieldsOptions)
                        setFinishLoad(r => true)
                    }
                )
        })

        return () => {
            controller.abort()
        }
    }, []);


    const systemOrLocationChange = () => {
        switch (valuesFields.typeLostResource) {
            case "20215" :
                return <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.INTERNAL_IT_SYSTEMS}
                                                   setFunction={(e:ChangeEvent) => setValuesFields({type: "addLostSystems", playLoad: e})}
                                                   isMulti={true}
                                                   jql={`id in (${optionsFields.systemsInProcess.map(option => option.value).join(',')})`}
                                                   title={'Утраченная система'}/>
            case "20216" :
                return <Components.Fields.FieldSelect id={"scenarioType"} title={"Вид сценария"} setFunction={(e: ChangeEvent) => setValuesFields({type: 'typeScenario', playLoad: e})}
                                                      options={optionsFields.scenarioType} placeholder={''}/>
            default:
                return ''
        }
    }

    const getMoreField = () => {
        console.log(valuesFields)
        switch (valuesFields.typeAction) {
            case "51108":
                break;
            case "51104":
                return valuesFields.lostSystems.map((opt) => <div key={opt.key + "SYSTEMS"}><span>{opt.label}:
                <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.INTERNAL_IT_SYSTEMS}
                                            placeholder={"Альтернативная система"}
                                            id={"alternativeSystems" + opt.key}
                                            title={""}
                                            jql={Tools.Storage.ConfigForJqlField.INTERNAL_IT_SYSTEMS.jql + `and key != ${opt.value}`}/>
            </span></div>)

            case "51102":
                return valuesFields.typeLostResource == "20215" ? valuesFields.lostSystems.map(opt => <div
                        key={opt.key + "PARTNERS"}><span>{opt.label}:
                <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.PARTNERS}
                                            placeholder={"Партнёр"}
                                            id={"alternativePartner" + opt.key}
                                            title={""}/></span></div>) :
                    <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.PARTNERS} title={''}/>
            case "51103":
                return <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.DEPARTMENT} title={''}/>
            case "51100":
                return <><Field name="typeWorkplace" defaultValue="" label={"Тип рабочего места"}>
                    {({fieldProps}) => (
                        <RadioGroup
                            {...fieldProps}
                            options={optionsFields.typeWorkplace}

                        />
                    )}
                </Field>
                    <Field name="submissionRequired" defaultValue="" label={"Требуется предоставление?"}>
                        {({fieldProps}) => (
                            <RadioGroup
                                {...fieldProps}
                                options={optionsSubmissionRequired}
                                onChange={e => {
                                    setSubmissionRequired(e.target.value)
                                    fieldProps.onChange(e)
                                }}
                            />
                        )}
                    </Field></>
            default:
                return ''
        }
    }

    const needProvide = () => {
        if (submissionRequired) {
            return submissionRequired == "inStock" ?
                <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.WORKPLACES} title={''}
                                            isMulti={true}/> :
                <>
                    <button disabled>Форма для создания</button>
                    <br/>
                </>
        }

    }


    return <>
        <h2>Экран редактирования</h2>
        <FormDefault>
            {finishLoad ?
                <>
                    <Components.Fields.FieldSelect id={"process"} placeholder={"Выберете процесс"}
                                                   title={"Процессы прикреплённые к плану"}
                                                   setFunction={ (e:events) => setValuesFields({type: 'addProcess', playLoad: e})}
                                                   options={optionsFields.processInBCP}/>

                    <Components.Fields.FieldRadioGroup name={"typeLostResource"} title={"Тип утраченного ресурса:"}
                                                       options={optionsFields.typeLostResource}
                                                       setFunction={(e:events) => setValuesFields({type: 'typeLostResource', playLoad: e})}/>


                    {systemOrLocationChange()}
                    {valuesFields.typeLostResource ?
                        <Components.Fields.FieldRadioGroup name={"scenarioAction"} title={"Тип действий:"}
                                                           options={optionsFields.scenarioAction.filter(opt => valuesFields.typeLostResource == "20215" ? scenarioTypeForSystem.includes(Number(opt.value)) : scenarioTypeForLocation.includes(Number(opt.value)))}
                                                           setFunction={(e:ChangeEvent) => setValuesFields({type: "typeAction", playLoad:e})}/> : ""}

                    {getMoreField()}
                    {needProvide()}

                </>
                :
                <Spinner/>}

        </FormDefault>
    </>
}

export default ScenarioScreen