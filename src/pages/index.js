import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "gatsby"

import Footer from "../components/footer"

const IndexPage = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios("/.netlify/functions/hello").then(response => setData(response))
  }, [])

  const handleCick = () => {
    console.log(data)
  }

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
      {data && <button onClick={handleCick}>Call Api</button>}
      <Footer />
    </div>
  )
}

export default IndexPage
