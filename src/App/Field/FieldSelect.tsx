import Select from "@atlaskit/select";
import {Field} from "@atlaskit/form";
import React, {useState} from "react";



export const FieldSelect = ({id, placeholder, title, options, setFunction, defaultValue, isSearchable=false, isClearable = false, description=null, isMulti=false}) => {
    const [value, setValue] = useState()


    return (
        <>
            <Field id={id} name={id} label={title}  defaultValue={defaultValue}>
                {({fieldProps: {onChange, ...rest}}) => (
                        <Select
                            {...rest}
                            placeholder = {placeholder ? placeholder : "Выбрать из выпадающего списка"}
                            isSearchable={isSearchable}
                            options={options}
                            onChange={event => {
                                setFunction? setFunction(event, id) : null
                                setValue(event)
                                onChange(event)
                            }}
                            isMulti = {isMulti}

                            isClearable = {isClearable}
                        />
                )}
            </Field>
        </>
    )
}

