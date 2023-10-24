import {Field} from "@atlaskit/form"
import {RadioGroup} from '@atlaskit/radio';
import React from "react";
import {OptionsPropType} from "@atlaskit/radio/types";

interface FieldRadioGroup {
    name: string,
    defaultValue?: any,
    title?: string,
    options: OptionsPropType,
    setFunction?: any
    isDisabled?: boolean
}

const opt = [
    {label: <h2>Какой-то текст</h2>, value: '20203', name: 'typeWorkplace'},
    {label: 'Донорское', value: '20204', name: 'typeWorkplace'}
]
export const FieldGr = ({name, defaultValue, title, options, setFunction}: FieldRadioGroup) => {
    console.log(options)
    return <Field name={name} defaultValue={defaultValue} label={title}>
        {({fieldProps}) => (
            <RadioGroup
                {...fieldProps}
                options={opt}
                onChange={e => {
                    setFunction(e)
                    fieldProps.onChange(e)
                }}
                isDisabled={fieldProps.isDisabled || undefined}
            />
        )}
    </Field>
}