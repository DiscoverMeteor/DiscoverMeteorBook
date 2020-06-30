ChangelogPage = React.createClass({
  
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
        <h2>Changelog</h2>
        <div className="post-content" dangerouslySetInnerHTML={this.getText()}></div>
      </Layout>
    )
  }

});