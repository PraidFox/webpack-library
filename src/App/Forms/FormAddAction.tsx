import React, {ChangeEvent, Fragment, useEffect, useState} from "react"
import {Tools, Components} from "@praidfox/tst-library"
import {Field} from "@atlaskit/form";
import TextArea from '@atlaskit/textarea';

const typeWhoAction = [
    {label: "Работник", value: "workers"},
    {label: "Группа", value: "group"},
    {label: "Должность", value: "position"},
    {label: "Роль", value: "role"},
]

const issue = Tools.Utils.BaseUtils.getCurrentIssueId()
const FormAddAction = ({sequence} : {sequence:number}) => {
    const [optionFieldRole, setOptionFieldRole] = useState<Tools.Interface.OptionsModal.RenderOptionsSelect[]>([])
    const [optionFieldTitleJob, setOptionFieldTitleJob] = useState<Tools.Interface.OptionsModal.RenderOptionsSelect[]>([])
    const [valueRole, setValueRole] = useState<string>('workers')

    const FieldsId = Tools.Storage.FieldsId

    useEffect(() => {
        const controller = new AbortController();

        Tools.Api.PluginTeamApi.getFieldOptions(FieldsId.ROLE, issue, controller.signal).then(r => {
            setOptionFieldRole(Tools.Utils.RenderOptions.selectOptions(r.data))
        })

        // @ts-ignore
        Tools.Api.PluginTeamApi.getFieldOptions(FieldsId.EMPLOYEE_POSITIONS_LIST, null, controller.signal).then(r => {
            setOptionFieldTitleJob(Tools.Utils.RenderOptions.selectOptions(r.data))
        })
    }, []);

    const getAssigneeField = () => {
        switch (valueRole) {
            case "workers":
                return <div key={"workers"}><Components.Fields.FieldJQL title={"Исполнитель"} placeholder={"Введите имя исполнителя"} id={"workers"}
                                                   fields={["summary"]} jql={`filter=${Tools.Storage.FiltersId.EMPLOYEE_AND_GROUP} and issueType= Сотрудник`}
                                                   optionsRender={Tools.Utils.RenderOptions.notInfo}
                                                   componentsRender={Tools.Utils.RenderComponentOptionsView.Info}/></div>
            case "group":
                return <div key={"group"}><Components.Fields.FieldJQL title={"Исполнитель"} placeholder={"Введите название группы"} id={"group"}
                                                   fields={["summary"]} jql={`filter=${Tools.Storage.FiltersId.EMPLOYEE_AND_GROUP} and issueType = "Группа сопровождения"`}
                                                   optionsRender={Tools.Utils.RenderOptions.notInfo}
                                                   componentsRender={Tools.Utils.RenderComponentOptionsView.Info}/></div>
            case "position":
                return  <div key={"position"}><Components.Fields.FieldSelect  id={'position'} placeholder={"Введите наименование должности"} isSearchable={true}
                                                       title={"Исполнитель"} options={optionFieldTitleJob}/></div>
            case "role":
                return   <div key={"role"}><Components.Fields.FieldSelect id={'role'} placeholder={"Введите наименование роли"} isSearchable={true}
                                                        title={"Исполнитель"} options={optionFieldRole}/></div>
            default:
                return ""
        }
    }

    return <>
        <Components.Fields.FieldNumber id={"sequence"} title={"Порядковый номер"} defaultValue={sequence}/>
        <Components.Fields.FieldNumber id={"duration"} title={"Время на исполнение, мин"} defaultValue={1}/>

        <Components.Fields.FieldRadioGroup name={"typeWhoAction"} options={typeWhoAction} defaultValue={"workers"} setFunction={(e:ChangeEvent<HTMLInputElement>) => setValueRole(e.target.value)}/>


        {getAssigneeField()}

        <Field label="Описание шага" name="stepDescription">
            {({ fieldProps }: any) => (
                <Fragment>
                    <TextArea
                        placeholder="Описание действие шага"
                        {...fieldProps}
                    />
                </Fragment>
            )}
        </Field>

    </>
}

export default FormAddAction