import { HOST } from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
  device: "/device",
};
const userData = JSON.parse(localStorage.getItem("authenticatedUser"));

// Check if the userData and token exist
const token = userData && userData.token ? userData.token : "";

function getDevices(callback) {
  let userData = JSON.parse(localStorage.getItem("authenticatedUser"));
  let token = userData && userData.token ? userData.token : "";

  let request = new Request(HOST.backend_device_api + endpoint.device, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(request.url);
  RestApiClient.performRequest(request, callback);
}

function updateDevice(id, device, callback) {
  let request = new Request(
    `${HOST.backend_device_api}${endpoint.device}/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(device),
    }
  );

  console.log("URL: " + request.url);

  RestApiClient.performRequest(request, callback);
}

function getUserDevices(userId, callback) {
  let request = new Request(
    `${HOST.backend_device_api}${endpoint.device}/userDevices/${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(request.url);
  RestApiClient.performRequest(request, callback);
}

function getDeviceById(params, callback) {
  let request = new Request(
    HOST.backend_device_api + endpoint.device + params.id,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(request.url);
  RestApiClient.performRequest(request, callback);
}

function postDevice(user, callback) {
  console.log("sth");
  let request = new Request(HOST.backend_device_api + endpoint.device, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  console.log("URL: " + request.url);

  RestApiClient.performRequest(request, callback);
}

function deleteDevice(id, callback) {
  let request = new Request(
    `${HOST.backend_device_api}${endpoint.device}/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("URL: " + request.url);
  RestApiClient.performRequest(request, callback);
}

export {
  getDevices,
  getDeviceById,
  postDevice,
  deleteDevice,
  getUserDevices,
  updateDevice,
};
