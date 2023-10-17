import {Tools} from "@praidfox/tst-library";
import {OptionPropType} from "@atlaskit/radio/types";

export interface ActionValuesFields {
    type: "addProcess" | "typeLostResource" | "addLostSystems" | "typeScenario" | "typeAction" | "alternativeDepartment" | "alternativePartner" | "alternativeSystems" | "typeWorkplace" | "needNewLocation" | "transitionWorkPlace",
    playLoad?: any
}

export interface ActionOptionsFields {
    type: "processInBCP" | "typeLostResource" | "systemsInProcess" | "scenarioType" | "scenarioAction" | "typeWorkplace"
    playLoad?: any
}

export interface ValuesFields {
    process: string
    typeLostResource: string,
    typeScenario: string,
    lostSystems: Tools.Interface.OptionsModal.RenderOptionsIssue[],
    typeAction: string,
    alternativeDepartment: any,
    alternativePartner: any,
    alternativeSystems: any,
    typeWorkplace: string,
    needNewLocation: string,
    transitionWorkPlace: any,
}

export interface FieldInScenarioScreen {
    processInBCP: Tools.Interface.OptionsModal.RenderOptionsIssue[],
    scenarioType: Tools.Interface.OptionsModal.RenderOptions[],
    typeLostResource: OptionPropType[],
    systemsInProcess: Tools.Interface.OptionsModal.RenderOptionsIssue[],
    scenarioAction: OptionPropType[],
    typeWorkplace: OptionPropType[],
}