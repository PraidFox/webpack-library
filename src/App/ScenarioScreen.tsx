import React, {ChangeEvent, useEffect, useReducer, useState} from "react"
import {Checkbox} from '@atlaskit/checkbox';
import Spinner from '@atlaskit/spinner';
import {Components, Tools} from "@praidfox/tst-library";
import {optionsSubmissionRequired, scenarioTypeForLocation, scenarioTypeForSystem} from "../tools/constants";
import {reducerOptionsField, reducerValueField} from "../tools/redusers";
import {FieldInScenarioScreen, ValuesFields} from "../tools/interfaces";
import FormDefault from "./FormDefault";
import _ from "lodash";

const issue = Tools.Utils.BaseUtils.getCurrentIssueId()
const ScenarioScreen = () => {
    const [optionsFields, setOptionsFields] = useReducer(reducerOptionsField, {} as FieldInScenarioScreen)
    const [valuesFields, setValuesFields] = useReducer(reducerValueField, {
        process: [],
        lostSystems: []
    } as ValuesFields)
    const [finishLoad, setFinishLoad] = useState<boolean>(false)
    const [onlyIntersecting, setOnlyIntersecting] = useState<boolean>(false)

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
            setFinishLoad(true)
        })
        return () => {
            controller.abort()
        }
    }, []);

    const getJqlForLostSystems = () => {
        if (onlyIntersecting) {
            return _.uniqWith(optionsFields.systemsInProcess?.map(x => optionsFields.systemsInProcess?.filter(y => y.key == x.key).length == valuesFields.process.length ? x : null).filter(x => x != null), _.isEqual)
        } else {
            return _.uniqWith(optionsFields.systemsInProcess, _.isEqual)
        }
    }

    const changeOnlyIntersecting = () => {
        if (!onlyIntersecting) {
            setValuesFields({
                type: "checkValueAndOptions",
                playLoad: {options: optionsFields.systemsInProcess, onlyIntersecting: !onlyIntersecting}
            })
        }
        setOnlyIntersecting(r => !r)
    }

    const getFieldSystemOrScenario = () => {
        switch (valuesFields.typeLostResource) {
            case OptionsId.MEASURE_RESOURCE_TYPE_IT_SYSTEM.toString() :
                return <>
                    <Components.Fields.FieldSelect
                        id={"internalItSystem"}
                        placeholder={'Введите название системы'}
                        title={"Утраченные системы"}
                        setFunction={(e: ChangeEvent<HTMLInputElement>) => setValuesFields({
                            type: "addLostSystems",
                            playLoad: e
                        })}
                        defaultValue={valuesFields.lostSystems}
                        options={getJqlForLostSystems()}
                        componentsRender={Tools.Utils.RenderComponentOptionsView.Info}
                        isClearable={false}
                        isMulti={true}
                        isSearchable={true}/>

                    {valuesFields.process.length > 1 && <Checkbox
                        value="onlyIntersecting"
                        label="Только пересекающиеся"
                        onChange={changeOnlyIntersecting}
                        isChecked={onlyIntersecting}
                        name="checkbox-default"
                    />}

                </>

            case OptionsId.MEASURE_RESOURCE_TYPE_OFFICE.toString() :
                return <Components.Fields.FieldSelect id={"typeScenario"} title={"Вид сценария"}
                                                      defaultValue={valuesFields.typeScenario}
                                                      options={optionsFields.scenarioType} placeholder={''}
                                                      setFunction={(e: ChangeEvent<HTMLInputElement>) => setValuesFields({
                                                          type: 'typeScenario',
                                                          playLoad: e
                                                      })}
                                                      isMulti={true}
                />
            default:
                return ''
        }
    }


    const getMoreField = () => {
        switch (Number(valuesFields.typeAction)) {
            case OptionsId.ACTIONS_NOT_POSSIBLE:
                return ""
            case OptionsId.MANUAL_EXECUTION:
                return ""
            case OptionsId.USING_ALTERNATIVE_SYSTEMS:

                return valuesFields.typeLostResource == OptionsId.MEASURE_RESOURCE_TYPE_IT_SYSTEM.toString() ?
                    valuesFields.lostSystems.map((opt) => <div key={opt.key + "SYSTEMS"}>
                <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.INTERNAL_IT_SYSTEMS}
                                            defaultValue={valuesFields.alternativeSystems?.filter(system => system.mainIssue === opt.value.toString())}
                                            placeholder={"Альтернативная система"}
                                            id={"alternativeSystems" + opt.key}
                                            title={opt.label}
                                            jql={Tools.Storage.ConfigForJqlField.INTERNAL_IT_SYSTEMS.jql + `and key != ${opt.value}`}
                                            setFunction={(e: ChangeEvent<HTMLInputElement>) => setValuesFields({
                                                type: "alternativeSystems",
                                                playLoad: {...e, mainIssue: opt.value}
                                            })}
                                            isClearable={false}/>
            </div>) : ''
            case OptionsId.OUTSOURCING:

                return valuesFields.typeLostResource == OptionsId.MEASURE_RESOURCE_TYPE_IT_SYSTEM.toString() ? valuesFields.lostSystems.map(opt =>
                        <div
                            key={opt.key + "PARTNERS"}>
                <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.PARTNERS}
                                            defaultValue={valuesFields.alternativePartnerMany?.filter(partner => partner.mainIssue === opt.value.toString())}
                                            placeholder={"Партнёр"}
                                            id={"alternativePartner" + opt.key}
                                            setFunction={(e: ChangeEvent<HTMLInputElement>) => setValuesFields({
                                                type: "alternativePartnerMany",
                                                playLoad: {...e, mainIssue: opt.value}
                                            })}
                                            isClearable={false}
                                            title={opt.label}/></div>)
                    :
                    <div key={"PARTNERS"}>
                        <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.PARTNERS}
                                                    id={"PARTNERS"}
                                                    title={'Контрагенты'}
                                                    defaultValue={valuesFields.alternativePartnerOne}
                                                    setFunction={(e: ChangeEvent<HTMLInputElement>) => setValuesFields({
                                                        type: "alternativePartnerOne",
                                                        playLoad: e
                                                    })}
                                                    isMulti={true}/>
                    </div>
            case OptionsId.TRANSFER_ANOTHER_DEPARTMENT:
                return <div key={"DEPARTMENT"}>
                    <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.DEPARTMENT}
                                                id={"DEPARTMENT"}
                                                title={'Подразделения'}
                                                defaultValue={valuesFields.alternativeDepartment}
                                                setFunction={(e) => setValuesFields({
                                                    type: "alternativeDepartment",
                                                    playLoad: e
                                                })}
                                                isMulti={true}
                    /></div>

            case OptionsId.TRANSITION_TO_BACKUP_LOCATIONS:
                return valuesFields.typeLostResource == OptionsId.MEASURE_RESOURCE_TYPE_OFFICE.toString() ? <>
                    <Components.Fields.FieldRadioGroup name={"typeWorkplace"} title={"Тип рабочего места"}
                                                       options={optionsFields.typeWorkplace}
                                                       setFunction={(e: ChangeEvent<HTMLInputElement>) => setValuesFields({
                                                           type: 'typeWorkplace',
                                                           playLoad: e.target.value
                                                       })}/>

                    <Components.Fields.FieldRadioGroup name={"needNewLocation"} title={"Требуется предоставление?"}
                                                       options={optionsSubmissionRequired}
                                                       setFunction={(e: ChangeEvent<HTMLInputElement>) => setValuesFields({
                                                           type: 'needNewLocation',
                                                           playLoad: e.target.value
                                                       })}/>

                    {needProvide()}
                </> : ''
            default:
                return ''
        }
    }
    console.log("valuesFields", valuesFields)
    const needProvide = () => {
        if (valuesFields.needNewLocation) {
            return valuesFields.needNewLocation == "false" ?
                <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.WORKPLACES} title={'Локации'}
                                            isMulti={true} isClearable={false}/> :
                <>
                    <br/>
                    <button disabled>Создать мероприятие на предоставление новой локации</button>
                    <br/>
                </>
        }

    }

    const changeProcess = (e: Tools.Interface.OptionsModal.RenderOptionsIssue[]) => {

        setValuesFields({
            type: 'addProcess',
            playLoad: {value: e}
        })

        e.length > 0 && Tools.Api.PluginResourceApi.getAllResourceInProcess(e.map(issue => issue.value), ``, "ItSystem")
            .then(r => {
                    setOptionsFields({
                        type: "systemsInProcess",
                        playLoad: {data: r.data, dispatch: setValuesFields, onlyIntersecting: onlyIntersecting}
                    })
                }
            )


    }


    const checkLevelValid = (lvl: number) => {
        switch (lvl) {
            case 1:
                return valuesFields.process.length > 0
            case 2:
                return valuesFields.process.length > 0 && valuesFields.typeLostResource
            case 3:
                return valuesFields.process.length > 0 && (valuesFields.typeLostResource == OptionsId.MEASURE_RESOURCE_TYPE_IT_SYSTEM.toString() && valuesFields.lostSystems.length > 0 || valuesFields.typeLostResource == OptionsId.MEASURE_RESOURCE_TYPE_OFFICE.toString() && valuesFields.typeScenario)
        }
    }
    return <>
        <h2>Экран редактирования</h2>

        <FormDefault>
            {finishLoad ?
                <>
                    <Components.Fields.FieldSelect
                        id={"process"}
                        placeholder={"Выберете процессы"}
                        title={""}
                        setFunction={changeProcess}
                        options={optionsFields.processInBCP}
                        defaultValue={valuesFields.process}
                        isMulti={true}
                    />

                    {checkLevelValid(1) &&
                        <Components.Fields.FieldRadioGroup
                            defaultValue={valuesFields.typeLostResource}
                            name={"typeLostResource"}
                            title={"Тип утраченного ресурса:"}
                            options={optionsFields.typeLostResource}
                            setFunction={(e: ChangeEvent<HTMLInputElement>) =>
                                setValuesFields({
                                    type: 'typeLostResource',
                                    playLoad: e.target.value
                                })
                            }
                        />
                    }

                    {checkLevelValid(2) && getFieldSystemOrScenario()}

                    {checkLevelValid(3) &&
                        <Components.Fields.FieldRadioGroup name={"typeAction"} title={"Тип действий:"}
                                                           options={optionsFields.scenarioAction.filter(opt => valuesFields.typeLostResource == "20215" ? scenarioTypeForSystem.includes(Number(opt.value)) : scenarioTypeForLocation.includes(Number(opt.value)))}
                                                           defaultValue={valuesFields.typeAction}
                                                           setFunction={(e: ChangeEvent<HTMLInputElement>) => setValuesFields({
                                                               type: "typeAction",
                                                               playLoad: e.target.value
                                                           })}/>}

                    {checkLevelValid(3) && getMoreField()}


                </>
                :
                <Spinner/>}

        </FormDefault>
    </>
}

export default ScenarioScreen