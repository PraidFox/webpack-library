import React, {ChangeEvent, useEffect, useReducer, useState} from "react"
import {RadioGroup} from '@atlaskit/radio';
import {Field} from "@atlaskit/form";
import Spinner from '@atlaskit/spinner';
import {Components, Tools} from "@praidfox/tst-library";
import {optionsSubmissionRequired, scenarioTypeForLocation, scenarioTypeForSystem} from "../tools/constants";
import {reducerOptionsField, reducerValueField} from "../tools/redusers";
import {FieldInScenarioScreen, ValuesFields} from "../tools/interfaces";
import FormDefault from "./FormDefault";






const issue = Tools.Utils.BaseUtils.getCurrentIssueId()
const ScenarioScreen = () => {
    const [optionsFields, setOptionsFields] = useReducer(reducerOptionsField, {} as FieldInScenarioScreen)
    const [valuesFields, setValuesFields] = useReducer(reducerValueField, {} as ValuesFields)
    const [finishLoad, setFinishLoad] = useState<boolean>(false)

    const OptionsId = Tools.Storage.OptionsId
    const FieldsId = Tools.Storage.FieldsId

    useEffect(() => {
        const controller = new AbortController();

        const p0 = Tools.Api.JiraApi.getIssue(issue, `${FieldsId.PROCESSES_MULTIPICKER}`, controller.signal)
        const p1 = Tools.Api.PluginTeamApi.getFieldOptions(FieldsId.PHYSICAL_OFFICE_LOS_SCENARIO, issue, controller.signal)
        const p2 = Tools.Api.PluginTeamApi.getFieldOptions(FieldsId.PHYSICAL_OFFICE_WORKPLACE_TYPE, issue, controller.signal)
        const p3 = Tools.Api.PluginTeamApi.getFieldOptions(FieldsId.TYPE_ACTIONS, issue, controller.signal)
        const p4 = Tools.Api.PluginTeamApi.getFieldOptions(FieldsId.BCP_PLAN_RESOURCE_TYPE, issue, controller.signal)

        Promise.all([p0, p1, p2, p3, p4]).then(r => {
            const processInBCP: Tools.Interface.BaseModel.Issue[] = r[0].data.fields[Tools.Utils.BaseUtils.getFieldNameForJql(FieldsId.PROCESSES_MULTIPICKER)]
            setOptionsFields({type: "processInBCP", playLoad: processInBCP})
            setOptionsFields({type: "scenarioType", playLoad: r[1].data})
            setOptionsFields({type: "typeWorkplace", playLoad: r[2].data})
            setOptionsFields({type: "scenarioAction", playLoad: r[3].data})
            setOptionsFields({type: "typeLostResource", playLoad: r[4].data})

            Tools.Api.PluginResourceApi.getAllResourceInProcess(processInBCP.map(issue => issue.id))
                .then(r => {
                        setOptionsFields({type: "systemsInProcess", playLoad: r.data})
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
            case OptionsId.MEASURE_RESOURCE_TYPE_IT_SYSTEM.toString() :
                return <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.INTERNAL_IT_SYSTEMS}
                                                   setFunction={(e: ChangeEvent) => setValuesFields({
                                                       type: "addLostSystems",
                                                       playLoad: e
                                                   })}
                                                   isMulti={true}
                                                   jql={`id in (${optionsFields.systemsInProcess.map(option => option.value).join(',')})`}
                                                   title={'Утраченные системы'}/>
            case OptionsId.MEASURE_RESOURCE_TYPE_OFFICE.toString() :
                return <Components.Fields.FieldSelect id={"scenarioType"} title={"Вид сценария"}
                                                      setFunction={(e: ChangeEvent) => setValuesFields({
                                                          type: 'typeScenario',
                                                          playLoad: e
                                                      })}
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

                return <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.DEPARTMENT} title={''}
                                                   setFunction={(e) => setValuesFields({
                                                       type: "alternativeDepartment",
                                                       playLoad: e.target
                                                   })}/>
            case "51100":
                return <><Field name="typeWorkplace" defaultValue="" label={"Тип рабочего места"}>
                    {({fieldProps}) => (
                        <RadioGroup
                            {...fieldProps}
                            options={optionsFields.typeWorkplace}

                        />
                    )}

                </Field>

                    <Components.Fields.FieldRadioGroup name={"needNewLocation"} title={"Требуется предоставление?"}
                                                       options={optionsSubmissionRequired}
                                                       setFunction={(e: ChangeEvent) => setValuesFields({
                                                           type: 'needNewLocation',
                                                           playLoad: e
                                                       })}/></>
            default:
                return ''
        }
    }

    const needProvide = () => {
        if (valuesFields.needNewLocation) {
            return valuesFields.needNewLocation == "false" ?
                <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.WORKPLACES} title={''}
                                            isMulti={true}/> :
                <>
                    <button disabled>Форма для создания</button>
                    <br/>
                </>
        }

    }

    const getPop = () => {
        if(valuesFields.process == "228402") return "none"
    }

    return <>
        <h2>Экран редактирования</h2>
        <FormDefault>
            {finishLoad ?
                <>
                    <Components.Fields.FieldSelect
                        id={"process"}
                        placeholder={"Выберете процесс"}
                        title={"Процессы прикреплённые к плану"}
                        setFunction={(e: ChangeEvent) => setValuesFields({
                            type: 'addProcess',
                            playLoad: e
                        })}
                        options={optionsFields.processInBCP}
                    />

                    <div style={{display: getPop()}}>
                        <Components.Fields.FieldSelect
                            id={"processV2"}
                            placeholder={"Выберете процесс"}
                            title={"Процессы прикреплённые к плану"}
                            setFunction={(e: ChangeEvent) => setValuesFields({
                                type: 'addProcess',
                                playLoad: e
                            })}
                            options={optionsFields.processInBCP}/>
                    </div>



                    {valuesFields.process &&
                        <Components.Fields.FieldRadioGroup
                            name={"typeLostResource"}
                            title={"Тип утраченного ресурса:"}
                            options={optionsFields.typeLostResource}
                            setFunction={(e: ChangeEvent) => setValuesFields({
                                type: 'typeLostResource',
                                playLoad: e
                            })}/>
                    }

                    {valuesFields.typeLostResource && systemOrLocationChange()}

                    {(valuesFields.lostSystems || valuesFields.typeScenario) &&
                        <Components.Fields.FieldRadioGroup name={"scenarioAction"} title={"Тип действий:"}
                                                           options={optionsFields.scenarioAction.filter(opt => valuesFields.typeLostResource == "20215" ? scenarioTypeForSystem.includes(Number(opt.value)) : scenarioTypeForLocation.includes(Number(opt.value)))}
                                                           setFunction={(e: ChangeEvent) => setValuesFields({
                                                               type: "typeAction",
                                                               playLoad: e
                                                           })}/>}

                    {getMoreField()}
                    {needProvide()}

                </>
                :
                <Spinner/>}

        </FormDefault>
    </>
}

export default ScenarioScreen