import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { FormGroup, Input, Label } from "reactstrap";
import Button from "react-bootstrap/Button";

import Validate from "./validators/user-validators";
import * as API_USERS from "../api/user-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";

const formControlsInit = {
  name: {
    value: "",
    placeholder: "What is your name?...",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 3,
      isRequired: true,
    },
  },
  email: {
    value: "",
    placeholder: "Email...",
    valid: false,
    touched: false,
    validationRules: {
      emailValidator: true,
    },
  },
  age: {
    value: "",
    placeholder: "Age...",
    valid: false,
    touched: false,
  },
  address: {
    value: "",
    placeholder: "Cluj, Zorilor, Str. Lalelelor 21...",
    valid: false,
    touched: false,
  },
};

function UserForm(props) {
  const [error, setError] = useState({ status: 0, errorMessage: null });
  const [formIsValid, setFormIsValid] = useState(false);
  const [formControls, setFormControls] = useState(formControlsInit);

  useEffect(() => {
    if (props.isUpdating) {
      // Populate the form fields with the updated data
      setFormControls({
        name: {
          ...formControls.name,
          value: props.updatedData.name,
        },
        email: {
          ...formControls.email,
          value: props.updatedData.email,
        },
        age: {
          ...formControls.age,
          value: props.updatedData.age,
        },
        address: {
          ...formControls.address,
          value: props.updatedData.address,
        },
      });
    } else {
      // Reset the form fields to their initial state when not in update mode
      setFormControls(formControlsInit);
    }
  }, [props.isUpdating, props.updatedData]);

  function handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;

    let updatedControls = { ...formControls };

    let updatedFormElement = updatedControls[name];

    updatedFormElement.value = value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = Validate(
      value,
      updatedFormElement.validationRules
    );
    updatedControls[name] = updatedFormElement;

    let formIsValid = true;
    for (let updatedFormElementName in updatedControls) {
      formIsValid =
        updatedControls[updatedFormElementName].valid && formIsValid;
    }

    setFormControls((formControls) => updatedControls);
    setFormIsValid((formIsValidPrev) => formIsValid);
  }

  function registerUser(user) {
    return API_USERS.postUser(user, (result, status, err) => {
      if (result !== null && (status === 200 || status === 201)) {
        console.log("Successfully inserted user with id: " + result);
        props.reloadHandler();
      } else {
        setError((error) => ({ status: status, errorMessage: err }));
      }
    });
  }

  //   function deleteUser(user) {
  //     return API_USERS.deleteUser(user, (result, status, err) => {
  //       if (result !== null && (status === 200 || status === 201)) {
  //         console.log("Successfully inserted user with id: " + result);
  //         props.reloadHandler();
  //       } else {
  //         setError((error) => ({ status: status, errorMessage: err }));
  //       }
  //     });
  //   }

  function handleSubmit() {
    let user = {
      name: formControls.name.value,
      email: formControls.email.value,
      age: formControls.age.value,
      address: formControls.address.value,
    };
    registerUser(user);
  }

  function handleUpdateSubmit() {}

  // function handleDelete() {
  //     let user = {
  //         id: formControls.id.value,
  //         name: formControls.name.value,
  //         email: formControls.email.value,
  //         age: formControls.age.value,
  //         address: formControls.address.value
  //     };
  //     deleteUser(user);
  // }

  return (
    <div>
      <FormGroup id="name">
        <Label for="nameField"> Name: </Label>
        <Input
          name="name"
          id="nameField"
          placeholder={formControls.name.placeholder}
          onChange={handleChange}
          defaultValue={formControls.name.value}
          touched={formControls.name.touched ? 1 : 0}
          valid={formControls.name.valid}
          required
        />
        {formControls.name.touched && !formControls.name.valid && (
          <div className={"error-message row"}>
            {" "}
            * Name must have at least 3 characters{" "}
          </div>
        )}
      </FormGroup>

      <FormGroup id="email">
        <Label for="emailField"> Email: </Label>
        <Input
          name="email"
          id="emailField"
          placeholder={formControls.email.placeholder}
          onChange={handleChange}
          defaultValue={formControls.email.value}
          touched={formControls.email.touched ? 1 : 0}
          valid={formControls.email.valid}
          required
        />
        {formControls.email.touched && !formControls.email.valid && (
          <div className={"error-message"}>
            {" "}
            * Email must have a valid format
          </div>
        )}
      </FormGroup>

      <FormGroup id="address">
        <Label for="addressField"> Address: </Label>
        <Input
          name="address"
          id="addressField"
          placeholder={formControls.address.placeholder}
          onChange={handleChange}
          defaultValue={formControls.address.value}
          touched={formControls.address.touched ? 1 : 0}
          valid={formControls.address.valid}
          required
        />
      </FormGroup>

      <FormGroup id="age">
        <Label for="ageField"> Age: </Label>
        <Input
          name="age"
          id="ageField"
          placeholder={formControls.age.placeholder}
          min={0}
          max={100}
          type="number"
          onChange={handleChange}
          defaultValue={formControls.age.value}
          touched={formControls.age.touched ? 1 : 0}
          valid={formControls.age.valid}
          required
        />
      </FormGroup>

      <Row>
        <Col sm={{ size: "4", offset: 8 }}>
          <Button
            type={"submit"}
            disabled={!formIsValid}
            onClick={props.isUpdating ? handleUpdateSubmit : handleSubmit}
          >
            {props.isUpdating ? "Update" : "Submit"}
          </Button>
        </Col>
      </Row>

      {error.status > 0 && (
        <APIResponseErrorMessage
          errorStatus={error.status}
          error={error.errorMessage}
        />
      )}
    </div>
  );
}

export default UserForm;
