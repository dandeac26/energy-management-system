import React, { useState, useEffect } from 'react';
import { Col, Row } from "reactstrap";
import { FormGroup, Input, Label } from 'reactstrap';
import Button from "react-bootstrap/Button";

import Validate from "./validators/person-validators";
import * as API_USERS from "../api/person-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";

const formControlsInit = {
    name: {
        value: '',
        placeholder: 'What is your name?...',
        valid: false,
        touched: false,
        validationRules: {
            minLength: 3,
            isRequired: true
        }
    },
    email: {
        value: '',
        placeholder: 'Email...',
        valid: false,
        touched: false,
        validationRules: {
            emailValidator: true
        }
    },
    age: {
        value: '',
        placeholder: 'Age...',
        valid: false,
        touched: false,
    },
    address: {
        value: '',
        placeholder: 'Cluj, Zorilor, Str. Lalelelor 21...',
        valid: false,
        touched: false,
    },
};

function PersonForm(props) {
    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [formIsValid, setFormIsValid] = useState(false);
    const [formControls, setFormControls] = useState(formControlsInit);

    function handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        let updatedControls = { ...formControls };

        let updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = Validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        setFormControls((formControls) => (updatedControls));
        setFormIsValid((formIsValidPrev) => (formIsValid));
    }


    function registerPerson(person) {
        return API_USERS.postPerson(person, (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted person with id: " + result);
                props.reloadHandler();
            } else {
                setError((error) => ({ status: status, errorMessage: err }));
            }
        });
    }

    function handleSubmit() {
        let person = {
            name: formControls.name.value,
            email: formControls.email.value,
            age: formControls.age.value,
            address: formControls.address.value
        };
        registerPerson(person);
    }

    return (
        <div>
            <FormGroup id='name'>
                <Label for='nameField'> Name: </Label>
                <Input name='name' id='nameField' placeholder={formControls.name.placeholder}
                    onChange={handleChange}
                    defaultValue={formControls.name.value}
                    touched={formControls.name.touched ? 1 : 0}
                    valid={formControls.name.valid}
                    required
                />
                {formControls.name.touched && !formControls.name.valid &&
                    <div className={"error-message row"}> * Name must have at least 3 characters </div>}
            </FormGroup>

            <FormGroup id='email'>
                <Label for='emailField'> Email: </Label>
                <Input name='email' id='emailField' placeholder={formControls.email.placeholder}
                    onChange={handleChange}
                    defaultValue={formControls.email.value}
                    touched={formControls.email.touched ? 1 : 0}
                    valid={formControls.email.valid}
                    required
                />
                {formControls.email.touched && !formControls.email.valid &&
                    <div className={"error-message"}> * Email must have a valid format</div>}
            </FormGroup>

            <FormGroup id='address'>
                <Label for='addressField'> Address: </Label>
                <Input name='address' id='addressField' placeholder={formControls.address.placeholder}
                    onChange={handleChange}
                    defaultValue={formControls.address.value}
                    touched={formControls.address.touched ? 1 : 0}
                    valid={formControls.address.valid}
                    required
                />
            </FormGroup>

            <FormGroup id='age'>
                <Label for='ageField'> Age: </Label>
                <Input name='age' id='ageField' placeholder={formControls.age.placeholder}
                    min={0} max={100} type="number"
                    onChange={handleChange}
                    defaultValue={formControls.age.value}
                    touched={formControls.age.touched ? 1 : 0}
                    valid={formControls.age.valid}
                    required
                />
            </FormGroup>

            <Row>
                <Col sm={{ size: '4', offset: 8 }}>
                    <Button type={"submit"} disabled={!formIsValid} onClick={handleSubmit}>  Submit </Button>
                </Col>
            </Row>

            {
                error.status > 0 &&
                <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />
            }
        </div>
    );
}

export default PersonForm;
