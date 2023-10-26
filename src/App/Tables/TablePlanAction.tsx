import React, {useReducer, useState} from "react"
import {reducerDataTableAction} from "../../tools/redusers";
import {ModalDefault} from "../Default/ModalDefault";
import FormDefault from "../Default/FormDefault";
import FormAddAction from "../Forms/FormAddAction";
import {Action, ScreenAction} from "../../tools/interfaces";
import {createHead, createRow} from "../../tools/templateAction";
import DynamicTable from "@atlaskit/dynamic-table";
import SectionMessage from "@atlaskit/section-message";

const TablePlanAction = ({data}: {data:Action[]}) => {
    // const [dataTable, setDataTable] = useReducer(reducerDataTableAction, {})

    return (
        <>
            <hr/>
            <h4>План исполнения процессов</h4>
            <DynamicTable
                head={createHead()}
                rows={createRow(data)}
                isFixedSize
                sortKey={"sequence"}
                sortOrder={"ASC"}
                emptyView={<h2>Пусто</h2>}
            />
        </>
    )
}

export default TablePlanAction