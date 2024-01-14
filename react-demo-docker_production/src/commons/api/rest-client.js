function performRequest(request, callback) {
  // Check if callback is a function
  if (typeof callback !== "function") {
    console.error("Callback provided to performRequest is not a function");
    return;
  }

  fetch(request)
    .then(function(response) {
      if (response.status === 204) {
        callback(null, response.status, null);
      } else if (response.ok) {
        return response
          .text()
          .then((text) => {
            return text ? JSON.parse(text) : {};
          })
          .then((json) => callback(json, response.status, null));
      } else {
        return response.text().then((text) => {
          const err = text ? JSON.parse(text) : {};
          callback(null, response.status, err);
        });
      }
    })
    .catch(function(err) {
      callback(null, 1, err);
    });
}

module.exports = {
  performRequest,
};
