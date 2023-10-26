import {Action} from "./interfaces";


export const createHead = () => {
    return {
        cells: [
            {
                key: 'sequence',
                content: 'Номер шага',
                width: 15,
            },
            {
                key: 'assignee',
                content: 'Исполнитель',
                width: 30,
            },
            {
                key: 'stepDescription',
                content: 'Описание шага',
                width: 30,
            },
            {
                key: 'duration',
                content: 'Время на исполнение, мин',
                width: 10,
            }
        ],
    };
};

export const head = createHead();


export const createRow = (data: Action[]) => {
    return data.map((value, index) => ({
            key: value.assignee.name + value.sequence + index,
            cells:
                [
                    {
                        key: value.sequence + index,
                        content: value.sequence,
                    },
                    {
                        key: value.assignee.name + index,
                        content: value.assignee.name,
                    },
                    {
                        key: "stepDescription"  + + index,
                        content: value.description
                    },
                    {
                        key: value.duration + + index,
                        content: value.duration,
                    }
                ]
        })
    )
}