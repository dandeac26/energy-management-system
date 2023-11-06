import { HOST } from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
  user: "/user",
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

export { getUsers, getUserById, postUser, deleteUser };
