/* global User */

define(['react'], function(React) {  
  
  var SmsPage = React.createClass({
    getInitialState: function() {
        return {code: this.props.code};
    },
    
    componentWillReceiveProps: function() {
        this.setState({code: this.props.code});
    },
    
    
    render: function() {
        var code = this.state.code;
        
        return  <form data-controller='pages_sms' data-submit='form-auth-sms' onsubmit='return false;' className='form-login'>
                    <p>Введите полученный код</p>
                    <p><input type='text' name='sms' placeholder='Код' autocomplete='off' value={code} /></p>
                    <p><button className='button_rounded--green'>Далее</button></p>
                </form>;
    }
  });

  return SmsPage;
});
