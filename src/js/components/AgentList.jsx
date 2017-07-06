/* global User */

define(['react'], function(React) {
    
  var ListItem = React.createClass({
    getInitialState: function() {
        var phone  = this.props.phone,
            name   = this.props.name || User.default_name,
            id     = this.props.id;
        
      return {photo: phone, name : name, id : id};
    },

      render: function() {
          return  <li data-id={this.state.id}>
                    <div>
                       <span>{this.state.name}</span><br/>
                       <p>{this.state.phone}</p>
                    </div>
                    <div>
                       <i class="icon-cancel-circled" data-click="remove-agent" data-id={this.state.id}></i>
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
          return <div>
                     <p><button className='button_wide--green' data-click='invite-agent'>Пригласить агента</button></p>
                     <ul className='trusted-contacts'>{list.map((item) => <ListItem name={item.name} 
                                                   phone={item.phone}
                                                   id={item.id}
                                                   key={item.id.toString()} />)}</ul>
                   </div>;
        } else {
            return <div>
                     <p><button className='button_wide--green' data-click='invite-agent'>Пригласить агента</button></p>
                     <ul className='trusted-contacts'><li>Нет доверенных агентов</li></ul>
                   </div>;
        }
    }
  });

  return List;
});
