import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { FormGroup, Input, Label } from "reactstrap";
import Button from "react-bootstrap/Button";

import Validate from "./validators/user-validators";
import * as API_USERS from "../api/user-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";

const validRoles = ["client", "admin"];
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

  password: {
    value: "",
    placeholder: "Password...",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 3,
      isRequired: true,
    },
  },
  role: {
    value: "",
    placeholder: "role...",
    valid: false,
    touched: true,
    customValidation: (value) => {
      if (!validRoles.includes(value)) {
        return "The value must be either 'client' or 'admin'.";
      }
      return null;
    },
  },
};

function UserForm(props) {
  const [error, setError] = useState({ status: 0, errorMessage: null });
  const [formIsValid, setFormIsValid] = useState(false);
  const [formControls, setFormControls] = useState(formControlsInit);

  useEffect(() => {
    if (props.isUpdating) {
      setFormControls({
        name: {
          ...formControls.name,
          value: props.updatedData.name,
        },

        password: {
          ...formControls.password,
        },
        role: {
          ...formControls.role,
          value: props.updatedData.role,
        },
      });
    } else {
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
        console.log("Inserted user with id: " + result);
        props.reloadHandler();
      } else {
        setError((error) => ({ status: status, errorMessage: err }));
      }
    });
  }

  function handleSubmit() {
    let user = {
      name: formControls.name.value,
      password: formControls.password.value,
      role: formControls.role.value,
    };
    registerUser(user);
  }

  function handleUpdateSubmit() {
    let user = {
      name: formControls.name.value,
      password: formControls.password.value,
      role: formControls.role.value,
    };
    API_USERS.updateUser(props.updatedData.id, user, (result, status, err) => {
      if (result !== null && (status === 200 || status === 201)) {
        console.log("Inserted user with id: " + result);
        props.reloadHandler();
      } else {
        setError((error) => ({ status: status, errorMessage: err }));
      }
    });
    window.location.reload();
  }

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

      <FormGroup id="role">
        <Label for="roleField"> Role: </Label>
        <Input
          name="role"
          id="roleField"
          placeholder={formControls.role.placeholder}
          onChange={handleChange}
          defaultValue={formControls.role.value}
          touched={formControls.role.touched ? 1 : 0}
          valid={formControls.role.valid}
          required
        />
        {formControls.role.touched && !formControls.role.valid && (
          <div classRole={"error-message row"}>
            {" "}
            * Role must be client or admin{" "}
          </div>
        )}
      </FormGroup>

      <FormGroup id="password">
        <Label for="passwordField"> Password: </Label>
        <Input
          name="password"
          id="passwordField"
          placeholder={formControls.password.placeholder}
          onChange={handleChange}
          defaultValue={formControls.password.value}
          touched={formControls.password.touched ? 1 : 0}
          valid={formControls.password.valid}
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
