import {ActionOptionsFields, ActionValuesFields, FieldInScenarioScreen, ValuesFields} from "./interfaces";
import {Tools} from "@praidfox/tst-library";

export const reducerValueField = (state: ValuesFields, action: ActionValuesFields): ValuesFields => {
    console.log(action)
    switch (action.type) {
        case "addProcess":
            //Процессы прикреплённые к плану
            return {
                ...state, process: action.playLoad.value
            }
        case "typeLostResource":
            //Тип утраченного ресурса
            return {
                ...state, typeLostResource: action.playLoad
            }
        case "addLostSystems":
            //Утраченные системы
            return {
                ...state, lostSystems: action.playLoad
            }
        case "typeScenario":
            //Вид сценария
            return {
                ...state, typeScenario: action.playLoad.value
            }
        case 'typeAction':
            //Тип действий
            return {
                ...state, typeAction: action.playLoad
            }
        // case "alternativeDepartment":
        //     return {
        //         ...state, alternativeDepartment: action.playLoad.value
        //     }
        // case 'alternativePartner':
        //     return {
        //         ...state, alternativePartner: action.playLoad
        //     }
        // case 'alternativeSystems':
        //     return {
        //         ...state, alternativeSystems: action.playLoad
        //     }
        // case 'typeWorkplace':
        //     return {
        //         ...state, typeWorkplace: action.playLoad
        //     }
        case 'needNewLocation':
            //Требуется предоставление
            return {
                ...state, needNewLocation: action.playLoad
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
            const resources: Tools.Interface.DtoModal.ResourceInfoDTO[] = action.playLoad
            return {
                ...state,
                systemsInProcess: resources.filter(res => res.resourceType == Tools.Storage.Constants.ResourceTypes.INTERNAL_IT_SYSTEM).map(resource => ({
                    label: resource.resourceIssue.summary,
                    value: resource.resourceIssue.id,
                    key: resource.resourceIssue.key
                }))
            }
        default:
            return state
    }
}