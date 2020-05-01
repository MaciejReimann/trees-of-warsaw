/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: "Full Stack Bootcamp",
    author: "Maciej Reimann",
  },
  /* Your site config here */
  plugins: [
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "src",
        path: `${__dirname}/src/`,
      },
    },
    // {
    //   resolve: `gatsby-plugin-react-css-modules`,
    //   options: {
    //     // *.css files are included by default.
    //     // To support another syntax (e.g. SCSS),
    //     // add `postcss-scss` to your project's devDependencies
    //     // and add the following option here:
    //     filetypes: {
    //       ".scss": { syntax: `postcss-scss` },
    //     },

    //     // Exclude global styles from the plugin using a RegExp:
    //     exclude: `\/global\/`,
    //     // For all the options check babel-plugin-react-css-modules README link provided above
    //   },
    // },
  ],
}
