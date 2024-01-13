import { HOST } from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
  user: "/user",
  authentication: "/authenticate",
  insertUserId: "/device/insertUserId",
};

function getUsers(callback) {
  let request = new Request(HOST.backend_api + endpoint.user, {
    method: "GET",
  });
  console.log(request.url);
  RestApiClient.performRequest(request, callback);
}

function getUserById(params, callback) {
  let request = new Request(HOST.backend_api + endpoint.user + params.id, {
    method: "GET",
  });

  console.log(request.url);
  RestApiClient.performRequest(request, callback);
}

function updateUser(id, user, callback) {
  let request = new Request(`${HOST.backend_api}${endpoint.user}/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  console.log("URL: " + request.url);

  RestApiClient.performRequest(request, callback);
}

function insertUserId(userId, callback) {
  let request = new Request(HOST.backend_device_api + endpoint.insertUserId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userId),
  });

  console.log("URL: " + request.url);

  RestApiClient.performRequest(request, callback);
}

function postUser(user, callback) {
  let request = new Request(HOST.backend_api + endpoint.user, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  console.log("URL: " + request.url);

  RestApiClient.performRequest(request, callback);
  insertUserId(user.id);
}

function authenticateUser(user, callback) {
  // Make a POST request to authenticate the user using the authentication endpoint
  let request = new Request(
    HOST.backend_api + endpoint.user + endpoint.authentication,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  console.log("URL: " + request.url);

  RestApiClient.performRequest(request, callback); // Pass the callback function here
}

function deleteUser(id, callback) {
  let request = new Request(`${HOST.backend_api}${endpoint.user}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(user)
  });

  console.log("URL: " + request.url);

  RestApiClient.performRequest(request, callback);
}

export {
  getUsers,
  getUserById,
  postUser,
  deleteUser,
  authenticateUser,
  updateUser,
  insertUserId,
};
