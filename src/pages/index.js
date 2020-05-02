import React, { useEffect } from "react"
import axios from "axios"
import { Link } from "gatsby"

import Footer from "../components/footer"

const apiWAW =
  "https://api.um.warszawa.pl/api/action/datastore_search/?resource_id=ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba&limit=5"

const requestConfig = {
  url: apiWAW,
  method: "get",
  headers: {},
}

const IndexPage = () => {
  const handleCick = () => {
    axios("/.netlify/functions/hello").then(response => console.log(response))
  }

  // axios(requestConfig)
  //   .then(function (response) {
  //     // handle success
  //     console.log(response)
  //   })
  //   .catch(function (error) {
  //     // handle error
  //     console.log(error)
  //   })
  //   .then(function () {
  //     // always executed
  //   })

  console.log("dupa")
  return (
    <div>
      <h1>Hello.</h1>
      <h2>Blah blah</h2>
      <p>
        Need a developer? <a href="/contact">Contact me</a>
      </p>
      <p>
        Need a developer? <Link to="/contact">Contact me</Link>
      </p>
      <button onClick={handleCick}>Call Api</button>
      <Footer />
    </div>
  )
}

export default IndexPage
