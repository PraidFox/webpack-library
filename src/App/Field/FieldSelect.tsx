import Select, {components} from "@atlaskit/select";
import {Field} from "@atlaskit/form";
import React, {useState} from "react";


interface FieldSelect {
    id: string
    placeholder: string
    title: string
    options: any[]
    setFunction?: any
    defaultValue?: any
    isSearchable?: boolean
    isClearable?: boolean
    description?: string
    isMulti?: boolean
    componentsRender?: any
}




export const FieldSelect = ({
                                id,
                                placeholder,
                                title,
                                options,
                                setFunction,
                                defaultValue,
                                isSearchable = false,
                                isClearable = false,
                                isMulti = false,
                                componentsRender
                            }: FieldSelect) => {

    const [value, setValue] = useState()

    return (
        <Field id={id} name={id} label={title} defaultValue={defaultValue}>
            {({fieldProps: {onChange, ...rest}}) => (
                <>
                    <Select
                        {...rest}
                        placeholder={placeholder ? placeholder : "Выбрать из выпадающего списка"}
                        isSearchable={isSearchable}
                        options={options}
                        onChange={e => {
                            setFunction ? setFunction(e, id) : null
                            setValue(e)
                            onChange(e)
                        }}

                        isMulti={isMulti}
                        isClearable={isClearable}
                        components={componentsRender}
                    />
                </>
            )}
        </Field>
    )
}
