/* global User */

define(['react', 'Dates'], function(React, Dates) {
    
  var ListItem = React.createClass({
    getInitialState: function() {
        var type    = this.props.type,
            text    = this.props.text,
            created = Dates.datetimeForPeople(this.props.created),
            id      = this.props.id,
            unread  = this.props.read ? 'unread' : '',
            text    = type==="invite" ? "Приглашение от агента" : text;    
      
      return {created: created, text : text, id : id, unread: unread};
    },
    
      render: function() {
          return <li className={this.state.unread}>
                    <div data-click='open-notify' data-id={this.state.id}>
                       <span>{this.state.created}</span>
                       {this.state.text}
                      </div>
                      <div>
                       <i className='icon-cancel-circled' data-click='delete-notify' data-id={this.state.id}></i>
                     </div>
                 </li>;
            }
  });
  
  
  var List = React.createClass({
    getInitialState: function() {
        return {list: this.props.list};
    },
    
    componentWillReceiveProps: function() {
        this.setState({list: this.props.list});
    },
    
    
    render: function() {
        var list = this.state.list;
        
        if (list.length > 0) {
          return <ul className='list-message'>{list.map((item) => <ListItem type={item.type} 
                                                   text={item.text}
                                                   read={item.read}
                                                   created={item.created}
                                                   id={item.id}
                                                   key={item.id.toString()} />)}</ul>;
        } else {
          return <ul className='list-message'><li><p>Нет сообщений</p></li></ul>;
        }
    }
  });

  return List;
});
