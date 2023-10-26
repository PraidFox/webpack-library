import {useCallback, useState} from 'react';

import {css, jsx} from '@emotion/react';

import Button from '@atlaskit/button/standard-button';

import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
} from '@atlaskit/modal-dialog';
import React from 'react';
import FormDefault from "./FormDefault";
import Form from "@atlaskit/form";
import {ScreenAction} from "../../tools/interfaces";

const boldStyles = css({
    fontWeight: 'bold',
});

export const ModalDefault = ({title, handler, children}: {title: string, handler: any, children: React.ReactNode}) => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);
    const [error, setError] = useState('')


    const onSubmit = (e: ScreenAction) => {
        const validation = handler(e)
        if (validation == "") {
            closeModal()
        } else {
            setError(validation)
        }
    }

    return (
        <div>
            <Button onClick={openModal}>
                Добавить действие
            </Button>

            <ModalTransition>
                {isOpen && (
                    <Modal width={"60%"} shouldScrollInViewport={true}>
                        {error}
                        <Form onSubmit={(data:ScreenAction) => onSubmit(data)}>
                            {({formProps}) => (
                                <form {...formProps}>
                                    <ModalHeader>
                                        <ModalTitle>{title}</ModalTitle>
                                    </ModalHeader>
                                    <ModalBody>
                                        {children}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button appearance="subtle" onClick={closeModal}>
                                            Отмена
                                        </Button>
                                        <Button appearance="primary" type="submit">
                                            Добавить
                                        </Button>
                                    </ModalFooter>
                                </form>
                            )}
                        </Form>
                    </Modal>
                )}
            </ModalTransition>
        </div>
    );
}