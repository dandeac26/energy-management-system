import { HOST } from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
  user: "/user",
  authentication: "/authenticate",
  insertUserIdEP: "/device/insertUserId",
};

const userData = JSON.parse(localStorage.getItem("authenticatedUser"));

// Check if the userData and token exist
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

  // Check if callback is a function, otherwise pass a no-op function
  RestApiClient.performRequest(
    request,
    typeof callback === "function" ? callback : () => {}
  );
}

// function insertUserId(DeviceUser, callback) {
//   let request = new Request(HOST.backend_device_api + endpoint.insertUserIdEP, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(DeviceUser),
//   });

//   console.log("URL: " + request.url);

//   RestApiClient.performRequest(request, callback);
// }

// function postUser(user, callback) {
//   let request = new Request(HOST.backend_api + endpoint.user, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   });

//   console.log("URL: " + request.url);

//   RestApiClient.performRequest(request, function(response, status, error) {
//     if (!error && response) {
//       let userId = response;

//       let devicesUser = {
//         userId: userId,
//         username: user.name,
//       };
//       insertUserId(devicesUser);
//     }

//     if (callback) {
//       callback(response, status, error);
//     }
//   });
// }

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
      // Call insertUserId with a proper callback or without one
      insertUserId(devicesUser, function(
        insertResponse,
        insertStatus,
        insertError
      ) {
        // Handle the response from insertUserId here, if needed
      });
    }

    if (typeof callback === "function") {
      callback(response, status, error);
    }
  });
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
