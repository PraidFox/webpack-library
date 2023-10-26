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
    const [input, setInput] = useState([])



    const getOptions = () => {
        let newOptions = options


        if(input.length > 0) {
            newOptions = newOptions.filter(opt => opt.label.includes(input))
        }
        if(newOptions.length > 100) {
            newOptions = newOptions.slice(0, 30)
        }


        return newOptions
    }

    return (
        <Field id={id} name={id} label={title} defaultValue={defaultValue}>
            {({fieldProps: {onChange, ...rest}}) => (
                <>
                    <Select
                        {...rest}
                        onInputChange={e => setInput(e)}
                        placeholder={placeholder ? placeholder : "Выбрать из выпадающего списка"}
                        isSearchable={isSearchable}
                        options={getOptions()}
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
