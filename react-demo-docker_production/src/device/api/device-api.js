import { HOST } from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
  device: "/device",
};

function getDevices(callback) {
  let request = new Request(HOST.backend_device_api + endpoint.device, {
    method: "GET",
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
  // Construct the GET request URL with the user's ID
  let request = new Request(
    `${HOST.backend_device_api}${endpoint.device}/userDevices/${userId}`,
    {
      method: "GET",
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
    }
  );

  console.log(request.url);
  RestApiClient.performRequest(request, callback);
}

function postDevice(user, callback) {
  let request = new Request(HOST.backend_device_api + endpoint.device, {
    method: "POST",
    headers: {
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
