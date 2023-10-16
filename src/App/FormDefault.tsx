import Form, {FormFooter} from "@atlaskit/form";
import Button from "@atlaskit/button";
import React from "react";



const FormDefault = ({children}) => {
    return (
        <Form
            onSubmit={(data) => {
                console.log('form data', data);
                //return Promise.resolve(validateOnSubmit(data));
            }}
        >
            {({ formProps }) => (
                <form {...formProps}>
                    {children}
                           <FormFooter>
                        <Button type="submit" appearance="primary">
                            Submit
                        </Button>
                    </FormFooter>
                </form>
            )}
        </Form>
    )
}

export default FormDefault