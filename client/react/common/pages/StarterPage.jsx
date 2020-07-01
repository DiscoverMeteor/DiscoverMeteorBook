StarterPage = createReactClass({
  
  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      changelog: Chapters.findOne({slug: "changelog"})
    }
  },

  getText() {
    return {
      __html: parseMarkdown(this.data.changelog.text)
    }; 
  },

  render() {
    return (
      <Layout>
        <div className="starter-message">
          <h2>Sorry, the Starter Edition is not available anymore.</h2>
          <p><a href={FlowRouter.path("homepage")}>Go back</a></p>
        </div>
      </Layout>
    )
  }

});