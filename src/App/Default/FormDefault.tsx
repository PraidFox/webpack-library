import Form, {FormFooter} from "@atlaskit/form";
import Button from "@atlaskit/button";
import React from "react";



const FormDefault = ({children} : {children: React.ReactNode}) => {
    return (
        <Form
            onSubmit={(data) => {
                //return Promise.resolve(validateOnSubmit(data));
            }}
        >
            {({ formProps }) => (
                <form {...formProps}>
                    {children}
                           <FormFooter>
                        <Button type="submit" appearance="primary">
                            Добавить
                        </Button>
                    </FormFooter>
                </form>
            )}
        </Form>
    )
}

export default FormDefault