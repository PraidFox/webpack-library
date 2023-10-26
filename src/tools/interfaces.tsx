import {Tools} from "@praidfox/tst-library";
import {OptionPropType} from "@atlaskit/radio/types";

export interface ActionValuesFields {
    type: "checkValueAndOptions" | "clearValueField" | "addProcess" | "typeLostResource" | "addLostSystems" | "typeScenario" | "typeAction" | "alternativeDepartment" | "alternativePartnerMany" | "alternativePartnerOne" | "alternativeSystems" | "typeWorkplace" | "needNewLocation" | "transitionWorkPlace",
    playLoad?: any
}

export interface ValuesFields {
    process: Tools.Interface.OptionsModal.RenderOptionsIssue[] | []
    typeLostResource: string,
    typeScenario: string,
    lostSystems: Tools.Interface.OptionsModal.RenderOptionsIssue[] | [],
    typeAction: string,
    alternativeDepartment: any,
    alternativePartnerMany: {label: string, value: string, key: string, info: string, mainIssue: string}[],
    alternativePartnerOne: any,
    alternativeSystems: {label: string, value: string, key: string, info: string, mainIssue: string}[],
    typeWorkplace: string,
    needNewLocation: string,
    transitionWorkPlace: any,
}

export interface ActionOptionsFields {
    type: "processInBCP" | "typeLostResource" | "systemsInProcess" | "scenarioType" | "scenarioAction" | "typeWorkplace"
    playLoad?: any
}

export interface FieldInScenarioScreen {
    processInBCP: Tools.Interface.OptionsModal.RenderOptionsIssue[],
    scenarioType: Tools.Interface.OptionsModal.RenderOptions[],
    typeLostResource: OptionPropType[],
    systemsInProcess: Tools.Interface.OptionsModal.RenderOptionsIssue[],
    scenarioAction: OptionPropType[],
    typeWorkplace: OptionPropType[],
}

export interface ScreenAction {
    sequence: number,
    duration: number,
    typeWhoAction: "workers" | "group" | "position" | "role",
    stepDescription: string,
    workers: Tools.Interface.OptionsModal.RenderOptionsIssue,
    group: Tools.Interface.OptionsModal.RenderOptionsIssue,
    position: Tools.Interface.OptionsModal.RenderOptionsSelect,
    role: Tools.Interface.OptionsModal.RenderOptionsSelect,
}
export interface Action {
    id?: number,
    sequence: number,
    assignee: {id: number, type: string, name: string}
    description: string
    duration: number,
    actionType: "action" | "notification"
}

export interface ActionNotification extends Action{
    actionType: "notification"
    stepBegin?: string
    levels?: []
}
