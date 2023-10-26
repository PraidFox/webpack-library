import Form, {FormFooter} from "@atlaskit/form";
import Button from "@atlaskit/button";
import React from "react";



const FormDefault = ({children} : {children: React.ReactNode}) => {
    return (
        <Form
            onSubmit={(data) => {}}
        >
            {({ formProps }) => (
                <form {...formProps}>
                    {children}

                </form>
            )}
        </Form>
    )
}

export default FormDefault