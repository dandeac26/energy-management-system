import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { FormGroup, Input, Label } from "reactstrap";
import Button from "react-bootstrap/Button";

import Validate from "./validators/device-validators";
import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";

const formControlsInit = {
  description: {
    value: "",
    placeholder: "Device description...",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 3,
      isRequired: true,
    },
  },
  userId: {
    value: "",
    placeholder: "userId...",
    valid: false,
    touched: false,
    validationRules: {
      isRequired: true,
    },
  },
  hourlyMaxConsumption: {
    value: "",
    placeholder: "hourlyMaxConsumption...",
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

function DeviceForm(props) {
  const [error, setError] = useState({ status: 0, errorMessage: null });
  const [formIsValid, setFormIsValid] = useState(false);
  const [formControls, setFormControls] = useState(formControlsInit);

  useEffect(() => {
    if (props.isUpdating) {
      // Populate the form fields with the updated data
      setFormControls({
        description: {
          ...formControls.description,
          value: props.updatedData.description,
        },
        userId: {
          ...formControls.userId,
          value: props.updatedData.userId,
        },
        hourlyMaxConsumption: {
          ...formControls.hourlyMaxConsumption,
          value: props.updatedData.hourlyMaxConsumption,
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
    if (props.isUpdating) {
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

      // Calculate the overall form validity considering only touched fields
      let isFormValid = true;
      for (let formElementName in updatedControls) {
        if (updatedControls[formElementName].touched) {
          isFormValid = updatedControls[formElementName].valid && isFormValid;
        }
      }

      setFormControls(updatedControls);
      setFormIsValid(isFormValid);
    } else {
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
  }

  function registerDevice(device) {
    return API_DEVICES.postDevice(device, (result, status, err) => {
      if (status === 400) {
        console.log("Probably invalid userId!");
        alert("Could not create device, probably invalid userId!");
      } else if (result !== null && (status === 200 || status === 201)) {
        console.log("Inserted device with id: " + result);
        props.reloadHandler();
      } else {
        setError((error) => ({ status: status, errorMessage: err }));
      }
    });
  }

  function handleSubmit() {
    let device = {
      description: formControls.description.value,
      userId: formControls.userId.value,
      hourlyMaxConsumption: formControls.hourlyMaxConsumption.value,
      address: formControls.address.value,
    };
    registerDevice(device);
  }
  function handleUpdateSubmit() {
    let device = {
      description: formControls.description.value,
      userId: formControls.userId.value,
      hourlyMaxConsumption: formControls.hourlyMaxConsumption.value,
      address: formControls.address.value,
    };
    API_DEVICES.updateDevice(
      props.updatedData.id,
      device,
      (result, status, err) => {
        if (result !== null && (status === 200 || status === 201)) {
          console.log("Inserted device with id: " + result);
          props.reloadHandler();
        } else {
          setError((error) => ({ status: status, errorMessage: err }));
        }
      }
    );
    window.location.reload();
  }

  return (
    <div>
      <FormGroup id="description">
        <Label for="descriptionField"> Description: </Label>
        <Input
          name="description"
          id="descriptionField"
          placeholder={formControls.description.placeholder}
          onChange={handleChange}
          defaultValue={formControls.description.value}
          touched={formControls.description.touched ? 1 : 0}
          valid={formControls.description.valid}
          required
        />
        {formControls.description.touched &&
          !formControls.description.valid && (
            <div className={"error-message row"}>
              {" "}
              * description must have at least 3 characters{" "}
            </div>
          )}
      </FormGroup>

      <FormGroup id="userId">
        <Label for="userIdField"> UserId: </Label>
        <Input
          name="userId"
          id="userIdField"
          placeholder={formControls.userId.placeholder}
          onChange={handleChange}
          defaultValue={formControls.userId.value}
          touched={formControls.userId.touched ? 1 : 0}
          valid={formControls.userId.valid}
          required
        />
        {formControls.userId.touched && !formControls.userId.valid && (
          <div className={"error-message"}>
            {" "}
            * userId must have a valid format
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

      <FormGroup id="hourlyMaxConsumption">
        <Label for="hourlyMaxConsumptionField"> Max Consumption / hour: </Label>
        <Input
          name="hourlyMaxConsumption"
          id="hourlyMaxConsumptionField"
          placeholder={formControls.hourlyMaxConsumption.placeholder}
          min={0}
          max={100}
          type="number"
          onChange={handleChange}
          defaultValue={formControls.hourlyMaxConsumption.value}
          touched={formControls.hourlyMaxConsumption.touched ? 1 : 0}
          valid={formControls.hourlyMaxConsumption.valid}
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

export default DeviceForm;
