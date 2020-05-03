const axios = require("axios")

const records = []

exports.handler = function (event, context, callback) {
  const baseURL = "https://api.um.warszawa.pl"
  const url = `${baseURL}/api/3/action/datastore_search/?resource_id=ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba`

  const limit = 40
  const urlWithLimit = `${url}&limit=${limit}`

  // TODO: add checking for database changes (e.g. res.data.result.total value)
  if (!records.length) {
    axios.get(urlWithLimit).then(res => {
      const nextUrl = `${baseURL}${res.data.result._links.next}`

      records.push(...res.data.result.records)

      axios.get(nextUrl).then(res => {
        records.push(...res.data.result.records)
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(records),
        })
      })
    })
  } else {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(records),
    })
  }
}
