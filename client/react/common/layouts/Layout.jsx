Layout = React.createClass({
  
  render() {
    return (
      <div className="layout">
        <Header />
        <div className='main' id='main'>
          <div className='row'>
            {this.props.children}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

});