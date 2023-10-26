import {ActionOptionsFields, ActionValuesFields, FieldInScenarioScreen, ValuesFields} from "./interfaces";
import {Tools} from "@praidfox/tst-library";

export const reducerValueField = (state: ValuesFields, action: ActionValuesFields): ValuesFields => {
    let value = [action.playLoad]

    switch (action.type) {
        case "addProcess":
            console.log("action.playLoad.value", action.playLoad.value)
            return {
                ...state, process: action.playLoad.value
            }

        case "typeLostResource":
            //Тип утраченного ресурса
            return {
                ...state, typeLostResource: action.playLoad
            }
        case "addLostSystems":
            let playLoad: Tools.Interface.OptionsModal.RenderOptionsIssue[] = action.playLoad
            let idSystem = playLoad.map(opt => opt.value.toString())

            return {
                ...state, lostSystems: action.playLoad,
                alternativePartnerMany: state.alternativePartnerMany?.filter(opt => idSystem.includes(opt.mainIssue.toString())),
                alternativeSystems: state.alternativeSystems?.filter(opt => idSystem.includes(opt.mainIssue.toString()))
            }
        case "typeScenario":
            //Вид сценария
            return {
                ...state, typeScenario: action.playLoad
            }
        case 'typeAction':
            //Тип действий
            return {
                ...state, typeAction: action.playLoad
            }
        case "alternativeDepartment":
            return {
                ...state, alternativeDepartment: action.playLoad
            }
        case 'alternativeSystems':
            if (state.alternativeSystems != undefined) {
                let alternativeSystems = state.alternativeSystems.find(opt => opt.mainIssue == action.playLoad.mainIssue)
                if (alternativeSystems) {
                    value = state.alternativeSystems.map(opt => opt.mainIssue == action.playLoad.mainIssue ? {
                        ...action.playLoad,
                        mainIssue: opt.mainIssue
                    } : opt)
                } else {
                    value = [...value, ...state.alternativeSystems]
                }
            }
            return {
                ...state, alternativeSystems: value
            }
        case 'alternativePartnerMany':
            if (state.alternativePartnerMany != undefined) {
                let alternativePartner = state.alternativePartnerMany.find(opt => opt.mainIssue == action.playLoad.mainIssue)
                if (alternativePartner) {
                    value = state.alternativePartnerMany.map(opt => opt.mainIssue == action.playLoad.mainIssue ? {
                        ...action.playLoad,
                        mainIssue: opt.mainIssue
                    } : opt)
                } else {
                    value = [...value, ...state.alternativePartnerMany]
                }
            }
            return {
                ...state, alternativePartnerMany: value
            }
        case 'alternativePartnerOne':
            return {
                ...state, alternativePartnerOne: action.playLoad
            }

        case 'typeWorkplace':
            return {
                ...state, typeWorkplace: action.playLoad
            }
        case 'needNewLocation':
            //Требуется предоставление
            return {
                ...state, needNewLocation: action.playLoad
            }
        case "clearValueField":
            return {...state, [action.playLoad]: null}

        case "checkValueAndOptions":
            return {
                ...state,
                ...checkLostSystems(action.playLoad.options, state, action.playLoad.onlyIntersecting)
            }
        default:
            return state
    }
}


export const reducerOptionsField = (state: FieldInScenarioScreen, action: ActionOptionsFields): FieldInScenarioScreen => {
    switch (action.type) {
        case "processInBCP":
            const processInBCP: Tools.Interface.BaseModel.Issue[] = action.playLoad
            return {
                ...state, processInBCP: processInBCP.map(issue => ({
                    label: issue.fields.summary,
                    value: issue.id,
                    key: issue.key
                }))
            }
        case "scenarioType":
            const scenarioType: Tools.Interface.BaseModel.Option[] = action.playLoad
            return {
                ...state, scenarioType: scenarioType.map(option => ({label: option.value, value: option.id}))
            }
        case "typeWorkplace":
            const typeWorkplace: Tools.Interface.BaseModel.Option[] = action.playLoad
            return {
                ...state, typeWorkplace: typeWorkplace.map(option => ({
                    label: option.value,
                    value: option.id.toString(),
                    name: "typeWorkplace"
                }))
            }
        case "typeLostResource":
            const typeLostResource: Tools.Interface.BaseModel.Option[] = action.playLoad
            return {
                ...state, typeLostResource: typeLostResource.map(option => ({
                    label: option.value,
                    value: option.id.toString(),
                    name: "typeLostResource"
                }))
            }
        case "scenarioAction":
            const scenarioAction: Tools.Interface.BaseModel.Option[] = action.playLoad
            return {
                ...state, scenarioAction: scenarioAction.map(option => ({
                    label: option.value,
                    value: option.id.toString(),
                    name: "scenarioAction"
                }))
            }

        case "systemsInProcess":
            const resources: Tools.Interface.DtoModal.ResourceInfoDTO[] = action.playLoad.data
            // //Запускать актуализацию уже выбранных опций в поле Утраченные системы
            // const options = resources.filter(res => res.resourceType == Tools.Storage.Constants.ResourceTypes.INTERNAL_IT_SYSTEM).map(resource => ({
            //     label: resource.resourceIssue.summary,
            //     value: resource.resourceIssue.id,
            //     key: resource.resourceIssue.key,
            //     info: resource.resourceIssue.fields["customfield_10212"]
            // }))


            action.playLoad.dispatch({
                type: "checkValueAndOptions",
                playLoad: {options: resources, onlyIntersecting: action.playLoad.onlyIntersecting}
            })


            return {
                ...state,
                systemsInProcess: resources
            }
        default:
            return state
    }
}


export const reducerDataTableAction = (state, action) => {
    return state
}

const checkLostSystems = (options, valuesFields, onlyIntersecting) => {

    let actualOptions = options

    if (onlyIntersecting) {
        actualOptions = options.map(x => options?.filter(y => y.key == x.key).length == valuesFields.process.length ? x : null).filter(x => x != null)
    }

    let lostSystems = valuesFields.lostSystems?.filter(value => actualOptions.map(val => val.value).includes(value.value))

    let alternativePartnerMany = valuesFields.alternativePartnerMany?.filter(opt => lostSystems.map(x => x.value).includes(opt.mainIssue))
    let alternativeSystems = valuesFields.alternativeSystems?.filter(opt => lostSystems.map(x => x.value).includes(opt.mainIssue))

    return {
        lostSystems: valuesFields.lostSystems?.filter(value => actualOptions.map(val => val.value).includes(value.value)),
        alternativePartnerMany: alternativePartnerMany,
        alternativeSystems: alternativeSystems
    }
}

