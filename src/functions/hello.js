const axios = require("axios")

exports.handler = function (event, context, callback) {
  console.log("queryStringParameters", event.queryStringParameters)

  axios({
    url:
      "https://api.um.warszawa.pl/api/action/datastore_search/?resource_id=ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba&limit=5",
    method: "get",
    headers: {},
  }).then(response => {
    // console.log("**************", )
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(response.data),
    })
  })

  // console.log("**************", data)
}
