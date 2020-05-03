import React from "react"
import { graphql } from "gatsby"

// import Layout from "../components/layout"

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
      }
      html
    }
  }
`

function Blog(props) {
  const {
    frontmatter: { title, date },
    html,
  } = props.data.markdownRemark

  console.log(props)

  return (
    <div>
      <h2> {title}</h2>
      <p>{date}</p>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
}

export default Blog
