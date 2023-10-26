import React, {ChangeEvent, useEffect, useReducer, useState} from "react"
import {Checkbox} from '@atlaskit/checkbox';
import Spinner from '@atlaskit/spinner';
import {Components, Tools} from "@praidfox/tst-library";
import {
    optionsSubmissionRequired,
    scenarioTypeForLocation,
    scenarioTypeForSystem,
    workTypeDescription
} from "../../tools/constants";
import {reducerOptionsField, reducerValueField} from "../../tools/redusers";
import {FieldInScenarioScreen, ValuesFields} from "../../tools/interfaces";
import _ from "lodash";
import {OptionsPropType} from "@atlaskit/radio/types";
import SectionMessage from '@atlaskit/section-message';
import {LostSystemRender} from "../../tools/renderComponentOptionsView";
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle'

const issue = Tools.Utils.BaseUtils.getCurrentIssueId()
const defaultValueFields = {
    process: [],
    lostSystems: []
}

const fontFamily = "var(--ds-font-family-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif)"
const ScenarioScreenTop = () => {
    const [optionsFields, setOptionsFields] = useReducer(reducerOptionsField, {} as FieldInScenarioScreen)
    const [valuesFields, setValuesFields] = useReducer(reducerValueField, defaultValueFields as ValuesFields)
    const [finishLoad, setFinishLoad] = useState<boolean>(false)
    const [onlyIntersecting, setOnlyIntersecting] = useState<boolean>(false)
    const [validTypeActions, setValidTypeActions] = useState(true)

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
            //Переписать на разовое сохранение, а не 5 раз ходить и записывать в стейт
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

    useEffect(() => {
        checkValidIntersectingNew()
    }, [valuesFields.lostSystems]);

    const changeOnlyIntersecting = () => {
        if (!onlyIntersecting) {
            setValuesFields({
                type: "checkValueAndOptions",
                playLoad: {options: optionsFields.systemsInProcess, onlyIntersecting: !onlyIntersecting}
            })
        }
        setOnlyIntersecting(r => !r)
    }
    const changeLostSystems = (e:Tools.Interface.OptionsModal.RenderOptionsIssue) => {
        setValuesFields({
            type: "addLostSystems",
            playLoad: e
        })
    }
    const changeProcess = (e: Tools.Interface.OptionsModal.RenderOptionsIssue[]) => {
        setValuesFields({
            type: 'addProcess',
            playLoad: {value: e}
        })

        e.length > 0 && Tools.Api.PluginResourceApi.getAllResourceInProcess(e.map(issue => issue.value), ``, "ItSystem")
            .then(r => {
                    let prev: Tools.Interface.DtoModal.ResourceInfoDTO[] = r.data
                    let data = prev.map(resource => ({
                        label: resource.resourceIssue.summary,
                        value: resource.resourceIssue.id,
                        key: resource.resourceIssue.key,
                        info: resource.resourceIssue.fields["customfield_10212"]
                    }))

                    // if (e.length >= 2) {
                    //     data = data.map(x => data?.filter(y => y.key == x.key).length == e.length ? {
                    //         ...x,
                    //         intersecting: true
                    //     } : x).filter(x => x != null)
                    // }

                    setOptionsFields({
                        type: "systemsInProcess",
                        playLoad: {data: data, dispatch: setValuesFields, onlyIntersecting: onlyIntersecting}
                    })
                }
            )


    }
    const changeTypeLostResource = (e: ChangeEvent<HTMLInputElement>) => {
        setValuesFields({
            type: 'typeLostResource',
            playLoad: e.target.value
        })

        if (e.target.value == OptionsId.MEASURE_RESOURCE_TYPE_IT_SYSTEM.toString()) {
            checkValidIntersectingNew()
        } else {
            setValidTypeActions(true)
        }
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
    const getOptionsForLostSystemField = () => {
        if (valuesFields.process.length > 1) {
            let noIntersectingValue = _.uniqWith(optionsFields.systemsInProcess?.map(x => optionsFields.systemsInProcess?.filter(y => y.key == x.key).length != valuesFields.process.length ? x : null).filter(x => x != null), _.isEqual)
            let intersectingValue = _.uniqWith(optionsFields.systemsInProcess?.map(x => optionsFields.systemsInProcess?.filter(y => y.key == x.key).length == valuesFields.process.length ? x : null).filter(x => x != null), _.isEqual)

            if (onlyIntersecting) {
                return [
                    {
                        label: 'Пересекающиеся системы',
                        options: intersectingValue
                    }
                ]
            } else {
                return [
                    {
                        label: 'Пересекающиеся системы',
                        options: intersectingValue
                    },
                    {
                        label: 'Не пересекающиеся системы',
                        options: noIntersectingValue
                    }
                ]
            }
        } else {
            return _.uniqWith(optionsFields.systemsInProcess, _.isEqual)
        }

    }
    const getOptionsForTypeAction = (): OptionsPropType => {
        let options = optionsFields.scenarioAction.filter(opt => valuesFields.typeLostResource == "20215" ? scenarioTypeForSystem.includes(Number(opt.value)) : scenarioTypeForLocation.includes(Number(opt.value)))

        if (!validTypeActions) {
            options = options.map(opt => opt.value != "51108" ? {...opt, isDisabled: true} : opt)
        }

        return options
    }

    const getSystemOrScenarioField = () => {
        switch (valuesFields.typeLostResource) {
            case OptionsId.MEASURE_RESOURCE_TYPE_IT_SYSTEM.toString() :
                return <>
                    <Components.Fields.FieldSelect
                        id={"internalItSystem"}
                        placeholder={'Введите название системы'}
                        title={"Утраченные системы"}
                        setFunction={changeLostSystems}
                        defaultValue={valuesFields.lostSystems}
                        options={getOptionsForLostSystemField()}
                        componentsRender={{Option: LostSystemRender}}
                        isClearable={false}
                        isMulti={true}
                        isSearchable={true}/>

                    {/*{valuesFields.process.length > 1 &&*/}
                    {/*    <>*/}
                    {/*        <Toggle*/}
                    {/*            onChange={changeOnlyIntersecting}*/}
                    {/*            isChecked={onlyIntersecting}*/}
                    {/*            id={"toggle-default"}*/}
                    {/*        />*/}
                    {/*        <label htmlFor="toggle-default" style={{fontFamily:fontFamily}}>Только пересекающиеся</label>*/}
                    {/*    </>*/}
                    {/*}*/}

                    {valuesFields.process.length > 1 && <Checkbox
                        label="Только пересекающиеся"
                        onChange={changeOnlyIntersecting}
                        isChecked={onlyIntersecting}
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
                let pop = optionsFields.typeWorkplace.map(opt => {
                    return {
                        ...opt,
                        label:
                            <>{opt.label}
                                <span title={workTypeDescription.get(opt.value)}>
                                <QuestionCircleIcon size={"small"}/>
                        </span>
                            </>
                    }
                })

                return valuesFields.typeLostResource == OptionsId.MEASURE_RESOURCE_TYPE_OFFICE.toString() ? <>
                    <Components.Fields.FieldRadioGroup name={"typeWorkplace"} title={"Тип рабочего места"}
                                                       options={pop}
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
    const checkValidIntersectingNew = () => {
        if (!onlyIntersecting && valuesFields.process.length > 1) {
            const actualOptions = optionsFields.systemsInProcess.map(x => optionsFields.systemsInProcess?.filter(y => y.key == x.key).length == valuesFields.process.length ? x : null).filter(x => x != null)
            if (valuesFields.lostSystems.length !== valuesFields.lostSystems.filter(value => actualOptions.map(val => val?.value).includes(value.value)).length) {
                setValuesFields({
                    type: "typeAction",
                    playLoad: "51108"
                })
                setValidTypeActions(false)
            } else {
                setValidTypeActions(true)
            }
        } else {
            setValidTypeActions(true)
        }
    }

    return <>
        <h2>Добавить сценарий</h2>
            {finishLoad ?
                <>
                    {checkLevelValid(3) && !validTypeActions &&
                        <SectionMessage title="Не пересекающаяся система" appearance="warning">
                        <span> {valuesFields.lostSystems.length > 1 ? "Выбранные системы не являются" : "Выбранная система не является"} частью другого процесса. Поэтому тип действий ограничен только
                            "{optionsFields.scenarioAction.filter(opt => opt.value == valuesFields.typeAction).map(opt => opt.label).join(", ")}"
                        </span>
                        </SectionMessage>}
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
                            setFunction={(e: ChangeEvent<HTMLInputElement>) => changeTypeLostResource(e)}
                        />
                    }

                    {checkLevelValid(2) && getSystemOrScenarioField()}

                    {checkLevelValid(3) &&
                        <Components.Fields.FieldRadioGroup name={"typeAction"} title={"Тип действий:"}
                                                           options={getOptionsForTypeAction()}
                                                           defaultValue={valuesFields.typeAction}
                                                           setFunction={(e: ChangeEvent<HTMLInputElement>) => setValuesFields({
                                                               type: "typeAction",
                                                               playLoad: e.target.value
                                                           })}
                        />}

                    {checkLevelValid(3) && getMoreField()}
                </>
                :
                <Spinner/>}



    </>
}

export default ScenarioScreenTop