import React from "react";
import {components} from "@atlaskit/select";
export const LostSystem = (props) => {
    console.log(props.data.intersecting)
    return (
        <components.Option {...props}>
            {props.children}
            <br />
            {props.data.key}
            <br />
            <i>{props.data?.info}</i>
        </components.Option>
    );
};