import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import Footer from "../components/footer"

const BlogPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              title
              date
            }
            fields {
              slug
            }
            html
            excerpt
          }
        }
      }
    }
  `)

  const nodes = data.allMarkdownRemark.edges.map(item => item.node)

  return (
    <div>
      <h1>Blog.</h1>
      <ol>
        {nodes.map((node, i) => {
          return (
            <li key={i}>
              <Link to={`/blog/${node.fields.slug}`}>
                <h2>{node.frontmatter.title}</h2>
                <p>{node.frontmatter.date}</p>
              </Link>
            </li>
          )
        })}
      </ol>
      <h2>Blah blah</h2>
      <Footer />
    </div>
  )
}

export default BlogPage
