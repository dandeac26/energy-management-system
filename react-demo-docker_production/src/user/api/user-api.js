import { HOST } from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
  user: "/user",
  authentication: "/authenticate",
  insertUserIdEP: "/device/insertUserId",
};

const userData = JSON.parse(localStorage.getItem("authenticatedUser"));

const token = userData && userData.token ? userData.token : "";

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

function insertUserId(DeviceUser, callback) {
  let request = new Request(HOST.backend_device_api + endpoint.insertUserIdEP, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(DeviceUser),
  });

  console.log("URL: " + request.url);

  RestApiClient.performRequest(
    request,
    typeof callback === "function" ? callback : () => {}
  );
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

  RestApiClient.performRequest(request, function(response, status, error) {
    if (!error && response) {
      let userId = response;

      let devicesUser = {
        userId: userId,
        username: user.name,
      };

      insertUserId(devicesUser, function(
        insertResponse,
        insertStatus,
        insertError
      ) {});
    }

    if (typeof callback === "function") {
      callback(response, status, error);
    }
  });
}

function authenticateUser(user, callback) {
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
