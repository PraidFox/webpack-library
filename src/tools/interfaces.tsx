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