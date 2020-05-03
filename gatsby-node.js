const _ = require("lodash")
const path = require("path")
const fs = require("fs")
const axios = require("axios")

module.exports.onPreBootstrap = async ({ node, actions }) => {
  // TODO: check if it is possible to set a context populated with this data available to gQL later on
  const baseURL = "https://api.um.warszawa.pl"
  const url = `${baseURL}/api/3/action/datastore_search/?resource_id=ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba`

  const limit = 10
  const urlWithLimit = `${url}&limit=${limit}`

  const res = await axios(urlWithLimit)

  const records = res.data.result.records
  console.log(records)

  createMDFiles(records)
}

module.exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (isMarkdownRemark(node)) {
    const slug = path.basename(node.fileAbsolutePath, ".md")

    createNodeField({
      node,
      name: "slug",
      value: slug,
    })
  }
}

module.exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const blogTemplate = path.resolve("./src/templates/blog.js")

  const response = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  response.data.allMarkdownRemark.edges.forEach(edge => {
    createPage({
      component: blogTemplate,
      path: `/blog/${edge.node.fields.slug}`,
      context: {
        slug: edge.node.fields.slug,
      },
    })
  })
}

function createMDFiles(records) {
  records.forEach(record => {
    const fileName = `${_.snakeCase(record.gatunek_1)}`
    const template = `--- \ntitle: "${record.gatunek_1}"\ndate: "${record.data_wyk_pom}"\n---\nSome other stuff about ${record.gatunek_1}`

    fs.writeFile(`./src/posts/${fileName}.md`, template, err => {
      if (err) throw err
      console.log("The file has been saved!")
    })
  })
}

const isMarkdownRemark = node => node.internal.type === "MarkdownRemark"
