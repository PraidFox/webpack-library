import React, {useEffect, useState} from "react"
import {Components, Tools, FieldSelect} from "@praidfox/tst-library";
import {OptionsPropType} from '@atlaskit/radio/types';
import {RadioGroup} from '@atlaskit/radio';
import FormDefault from "./FormDefault";
import Form, {Field} from '@atlaskit/form';
import {FieldSelectttttt} from "./Field/FieldSelect";
import Select from "@atlaskit/select";




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
    scenarioAction: Tools.Interface.OptionsModal.RenderOptions[],
    typeWorkplace: Tools.Interface.OptionsModal.RenderOptions[],
}



const issue = Tools.Utils.BaseUtils.getCurrentIssueId()
const ScenarioScreen = () => {
    const [fieldsOptions, setFieldsOptions] = useState<fieldInScenarioScreen| {}>({})
    const [systemOrLocation, setSystemOrLocation] = useState<string>()
    const [submissionRequired, setSubmissionRequired] = useState<string>()
    const [finishLoad, setFinishLoad] = useState<boolean>(false)

    //
    useEffect(() => {
        const controller = new AbortController();

        const p0 = Tools.Api.JiraApi.getIssue(issue, `${Tools.Storage.FieldsId.PROCESSES_MULTIPICKER}`, controller.signal)
        const p1 = Tools.Api.PluginTeamApi.getFieldOptions(13700, issue, controller.signal)
        const p2 = Tools.Api.PluginTeamApi.getFieldOptions(17401, issue, controller.signal)
        const p3 = Tools.Api.PluginTeamApi.getFieldOptions(13701, issue, controller.signal)

        Promise.all([p0, p1, p2, p3,]).then(r => {

            let newFieldsOptions = JSON.parse(JSON.stringify(fieldsOptions))
            let processInBCP: Tools.Interface.BaseModel.Issue[] = r[0].data.fields[Tools.Utils.BaseUtils.getFieldNameForJql(Tools.Storage.FieldsId.PROCESSES_MULTIPICKER)]

            newFieldsOptions['processInBCP'] = processInBCP.map(issue => ({label: issue.fields.summary, value: issue.id}))
            Tools.Api.PluginResourceApi.getAllResourceInProcess(processInBCP.map(issue => issue.id))
                .then(r => {
                    const resources:Tools.Interface.DtoModal.ResourceInfoDTO[] = r.data
                    newFieldsOptions['systemsInProcess'] = resources.map(resource => ({label: resource.objectIssue.summary, value: resource.objectIssue.id}))
                })

            setFieldsOptions(newFieldsOptions)
            setFinishLoad(r => true)
        })

        return () => {
            controller.abort()
        }
    }, []);



    return <>
        <h2>Экран редактирования</h2>
      <FormDefault>
            <span id="radiogroup-system-or-location">Выбор утраченного ресурса:</span>
            <Field name="systemOrLocation" defaultValue="">
                {({fieldProps}) => (
                    <RadioGroup
                        {...fieldProps}
                        options={optionsForSystemOrLocation}
                        onChange={e => {
                            setSystemOrLocation(e.target.value)
                            fieldProps.onChange(e)
                        }}
                        aria-labelledby="radiogroup-system-or-location"
                    />
                )}
            </Field>


            <span id="radiogroup-submission-required">Требуется предоставление?</span>
          <Field name="submissionRequired" defaultValue="">
              {({fieldProps}) => (
            <RadioGroup
                {...fieldProps}
                options={optionsSubmissionRequired}
                onChange={e => {
                    setSubmissionRequired(e.target.value)
                    fieldProps.onChange(e)
                }}
                aria-labelledby="radiogroup-submission-required"
            />
              )}
          </Field>



            <Components.Fields.FieldJQL
                {...Tools.Storage.ConfigForJqlField.EXTERNAL_IT_SYSTEMS}
            />

          {/*<FieldSelectttttt id={"process"}  placeholder={"Введите"} title={"Процесс"} options={optionsSubmissionRequired}/>*/}
          {/*<Components.Fields.FieldSelect id={"procesfsdfsds"} />*/}
         <Components.Fields.SpinnerTst/>

          {/*<FieldSelect id={"ssss"}/>*/}

          {/*{finishLoad ? Components.Fields.FieldSelect({id: "process", placeholder: "Введите", title: "Процесс", options: fieldsOptions["processInBCP"]}) : "Загружается"}*/}
          {/*  {Components.Fields.FieldSelect({id: "process", placeholder: "Введите", title: "Процесс", options: optionsSubmissionRequired})}*/}
          {/*  {Components.Fields.FieldJQL({...Tools.Storage.ConfigForJqlField.INTERNAL_IT_SYSTEMS, title: ''})}*/}
          {/*  {Components.Fields.FieldJQL({...Tools.Storage.ConfigForJqlField.PARTNERS, title: ''})}*/}
          {/*  {Components.Fields.FieldJQL({...Tools.Storage.ConfigForJqlField.DEPARTMENT, title: ''})}*/}
          {/*  {Components.Fields.FieldJQL({...Tools.Storage.ConfigForJqlField.WORKPLACES, title: ''})}*/}

        </FormDefault>
    </>
}

export default ScenarioScreen