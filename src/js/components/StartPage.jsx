/* global User */

define(['react'], function(React) {  
  
  var StartPage = React.createClass({
    getInitialState: function() {
        return {text: this.props.text};
    },
    
    componentWillReceiveProps: function() {
        this.setState({text: this.props.text});
    },
    
    
    render: function() {
        var text = this.state.text;
        
        return <div>
                   <div className='start_logo'>
                       <img src='assets/images/start_logo.jpg' alt='Tech Agent'/>
                   </div>
                   <div className="start_logo_state">
                       <p className="start_logo_state__text">{text}</p>
                   </div>
                   <div className="start_logo__again_location" data-click="again-location">G</div>
               </div>;
    }
  });

  return StartPage;
});
