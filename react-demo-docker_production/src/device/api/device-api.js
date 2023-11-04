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

export { getDevices, getDeviceById, postDevice };
