import React, {useEffect, useState} from "react"

 import {Components, Tools} from "@praidfox/tst-library";
import {OptionsPropType} from '@atlaskit/radio/types';
import {RadioGroup} from '@atlaskit/radio';
import FormDefault from "./FormDefault";
import {Field} from "@atlaskit/form";
import {scenarioTypeForLocation, scenarioTypeForSystem} from "./tools/utils";

const optionsForSystemOrLocation: OptionsPropType = [
    {name: 'systemOrLocation', value: 'systems', label: 'Система'},
    {name: 'systemOrLocation', value: 'location', label: 'Локация'},
];

const optionsSubmissionRequired: OptionsPropType = [
    {name: 'submissionRequired', value: 'inStock', label: 'Есть в наличии'},
    {name: 'submissionRequired', value: 'mustProvided', label: 'Необходимо предоставить'},
];

interface fieldInScenarioScreen {
    processInBCP: Tools.Interface.OptionsModal.RenderOptions[],
    systemsInProcess: Tools.Interface.OptionsModal.RenderOptions[],
    scenarioType: Tools.Interface.OptionsModal.RenderOptions[],
    scenarioAction: any,
    typeWorkplace: Tools.Interface.OptionsModal.RenderOptions[],
}


const issue = Tools.Utils.BaseUtils.getCurrentIssueId()
const ScenarioScreen = () => {

    const [fieldsOptions, setFieldsOptions] = useState({} as fieldInScenarioScreen)
    const [systemOrLocation, setSystemOrLocation] = useState<string>()
    const [lostSystems, setLostSystems] = useState()
    const [submissionRequired, setSubmissionRequired] = useState<string>()
    const [finishLoad, setFinishLoad] = useState<boolean>(false)
    const [typeActionValue, setTypeActionValue] = useState<string>()

    useEffect(() => {
        const controller = new AbortController();

        const p0 = Tools.Api.JiraApi.getIssue(issue, `${Tools.Storage.FieldsId.PROCESSES_MULTIPICKER}`, controller.signal)
        const p1 = Tools.Api.PluginTeamApi.getFieldOptions(13700, issue, controller.signal)
        const p2 = Tools.Api.PluginTeamApi.getFieldOptions(13701, issue, controller.signal)
        const p3 = Tools.Api.PluginTeamApi.getFieldOptions(17401, issue, controller.signal)


        Promise.all([p0, p1, p2, p3,]).then(r => {

            let newFieldsOptions = JSON.parse(JSON.stringify(fieldsOptions))
            const processInBCP: Tools.Interface.BaseModel.Issue[] = r[0].data.fields[Tools.Utils.BaseUtils.getFieldNameForJql(Tools.Storage.FieldsId.PROCESSES_MULTIPICKER)]

            newFieldsOptions['processInBCP'] = processInBCP.map(issue => ({
                label: issue.fields.summary,
                value: issue.id
            }))

            const scenarioType: Tools.Interface.BaseModel.Option[] = r[1].data
            newFieldsOptions["scenarioType"] =  scenarioType.map(option => ({label: option.value, value: option.id}))

            const scenarioAction: Tools.Interface.BaseModel.Option[] = r[3].data
            newFieldsOptions["scenarioAction"] =  scenarioAction.map(option => ({label: option.value, value: option.id.toString(), name: "scenarioAction"}))



            Tools.Api.PluginResourceApi.getAllResourceInProcess(processInBCP.map(issue => issue.id))
                .then(r => {
                        const resources: Tools.Interface.DtoModal.ResourceInfoDTO[] = r.data
                        newFieldsOptions['systemsInProcess'] = resources.map(resource => ({
                            label: resource.objectIssue.summary,
                            value: resource.objectIssue.id
                        }))

                    setFieldsOptions(newFieldsOptions)
                    setFinishLoad(r => true)
                    }
                )
        })

        return () => {
            controller.abort()
        }
    }, []);

    const pop = (e) => {
        console.log(e)
    }
    const systemOrLocationChange = () => {
        switch (systemOrLocation) {
            case "systems" : return <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.INTERNAL_IT_SYSTEMS} setFunction={pop} isMulti={true} jql = {`id in (${fieldsOptions.systemsInProcess.map(option => option.value).join(',')})`} title={'Утраченная система'}/>
            case "location" : return <Components.Fields.FieldSelect id={"scenarioType"} title={"Вид сценария"} options={fieldsOptions.scenarioType}/>
            default: return ''
        }
    }

    const getMoreField = () => {
        switch (typeActionValue) {
            case "51108": console.log("Блокируем и только сохранение")
            case "51104": console.log("Выводим на каждую потерянную систему альтернативу")

        }
        console.log(typeActionValue)
    }


    return <>
        <h2>Экран редактирования</h2>
        <FormDefault>

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
            </Field>

            {finishLoad ?
                <>
                    <Components.Fields.FieldSelect id={"process"} placeholder={"Выберете процесс"} title={"Процессы прикреплённые к плану"}
                                                   options={fieldsOptions.processInBCP}/>

                    <Field name="systemOrLocation" defaultValue="" label={"Выбор утраченного ресурса:"}>
                        {({fieldProps}) => (
                            <RadioGroup
                                {...fieldProps}
                                options={optionsForSystemOrLocation}
                                onChange={e => {
                                    setSystemOrLocation(e.target.value)
                                    fieldProps.onChange(e)
                                }}
                            />
                        )}
                    </Field>

                    {systemOrLocationChange()}
                    {systemOrLocation ? <Field name="scenarioAction" defaultValue="" label={"Тип действий:"}>
                        {({fieldProps}) => (
                            <RadioGroup
                                {...fieldProps}
                                options={fieldsOptions.scenarioAction.filter(opt => systemOrLocation== "systems" ? scenarioTypeForSystem.includes(Number(opt.value)) : scenarioTypeForLocation.includes(Number(opt.value)))}
                                onChange={
                                       e => {setTypeActionValue(e.target.value)
                                           console.log(e.target.value)
                                       fieldProps.onChange(e)
                                       }
                                }
                            />
                        )}
                    </Field> : ""}

                    {getMoreField()}


                    {/*<Field id={"process"} name={"process"} label={"Процессы прикреплённые к плану"} >*/}
                    {/*    {({fieldProps}) => (*/}
                    {/*      <Components.Fields.FieldSelectNoField fieldProps={fieldProps} id={"process"} placeholder={"Выберете процесс"}*/}
                    {/*                                            options={fieldsOptions.processInBCP}></Components.Fields.FieldSelectNoField>*/}
                    {/*    )}*/}
                    {/*</Field>*/}



                    <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.PARTNERS} title={''}/>
                    <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.DEPARTMENT} title={''}/>
                    <Components.Fields.FieldJQL {...Tools.Storage.ConfigForJqlField.WORKPLACES} title={''}/>
                </>
                :

                "Загружается"}

            ---По мере заполнения будут появляться новые поля---
        </FormDefault>
    </>
}

export default ScenarioScreen