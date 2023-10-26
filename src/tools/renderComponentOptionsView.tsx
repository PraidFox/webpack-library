import React from "react";
import {components} from "@atlaskit/select";
import {GroupHeadingProps} from "@atlaskit/select"

export const LostSystemRender = (props) => {
    return (
        <>
            <components.Option {...props}>
                {props.children}
                <br/>
                {props.data.key}
                <br/>
                <i>{props.data?.info}</i>
            </components.Option>
        </>
    );
};

export const GroupHeadingRender = (props: GroupHeadingProps) => (

    // <components.GroupHeading style={{fontWeight: "bold"}} {...props} />
    <components.GroupHeading style={{backgroundColor: "#ff0000"}} {...props} />
    //<components.GroupHeading {...props} />


);