/* global User */

define(['react'], function(React) {  
  
  var MessagePage = React.createClass({
    getInitialState: function() {
        return {message: this.props.code};
    },
    
    componentWillReceiveProps: function() {
        this.setState({message: this.props.code});
    },
    
    
    render: function() {
        var message = this.state.message,
        
        type = message.type,
        text = message.text,
        args = message.args,
        id   = message.id;
    
        if (type === "invite") {

          text += '<div>' +
                  '<button class="button_rounded--grey" data-click="recept-invite">Отказать</button>' +
                  '<button class="button_rounded--green" data-id="' + id + '" data-click="accept-invite">Принять</button>' +
                 '</div>';
        }

        if (type === "sos") {
          var isDr = args.isDriver ? 'Водитель ' : 'Клиент ';

          text += '<p>Внимание</p>' + 
                            '<p>' + isDr + args.name + ' в опасности!</p>' +
                            '<p>Текущие координаты: ' + args.location + '</p>';
        }

        return  <ul className="list-message">
                    <li data-id={id} data-click='open-notify'>
                        {text}
                    </li>
                </ul>;
    }
  });

  return MessagePage;
});
