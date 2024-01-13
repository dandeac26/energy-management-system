function performRequest(request, callback) {
  fetch(request)
    .then(function(response) {
      if (response.status === 204) {
        // No content
        callback(null, response.status, null);
      } else if (response.ok) {
        return response
          .text()
          .then((text) => {
            try {
              // Parse JSON only if response is not empty
              return text ? JSON.parse(text) : {};
            } catch (error) {
              throw new SyntaxError("Failed to parse JSON");
            }
          })
          .then((json) => callback(json, response.status, null));
      } else {
        return response.text().then((text) => {
          try {
            // Parse error JSON only if response is not empty
            const err = text ? JSON.parse(text) : {};
            callback(null, response.status, err);
          } catch (error) {
            throw new SyntaxError("Failed to parse error response JSON");
          }
        });
      }
    })
    .catch(function(err) {
      // Catch any unexpected errors
      callback(null, 1, err);
    });
}

module.exports = {
  performRequest,
};
