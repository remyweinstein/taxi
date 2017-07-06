/* global User */

define(['react'], function(React) {
    
  var ListItem = React.createClass({
    getInitialState: function() {
        var active = this.props.sosZones ? true : false,
            name   = this.props.name || User.default_name,
            id     = this.props.id;
        
      return {active: active, name : name, id : id};
    },
    _active : <i className='icon-ok active'></i>,
    render: function() {
        return  <li data-id={this.state.id}>
                    <div data-click='open-map' data-id={this.state.id}>
                      {this.state.name}
                    </div>
                    <div>
                      {this.state.active ? _active : ''}
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
          return <ul className='list-message'>{list.map((item) => <ListItem name={item.name} 
                                                   sosZones={item.sosZones}
                                                   id={item.id}
                                                   key={item.id.toString()} />)}</ul>;
        } else {
            return <ul className='list-message'><li>Не найдены агенты</li></ul>;
        }
    }
  });

  return List;
});
