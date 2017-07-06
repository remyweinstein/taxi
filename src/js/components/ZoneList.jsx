/* global User */

define(['react'], function(React) {
    
  var ListItem = React.createClass({
    getInitialState: function() {
        var note   = this.props.note || '',
            name   = this.props.name || 'Зона ' + this.props.id,
            id     = this.props.id;
        
      return {note: note, name : name, id : id};
    },

      render: function() {
            return <li data-click='edit-zone' data-id={this.state.id}>
                     <p>{this.state.name}</p>
                     <i className="icon-trash" data-click="delete-zone"></i>
                     <span>{this.state.note}</span>
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
          return <ul className='list-zone'>{list.map((item) => <ListItem name={item.name} 
                                                   note={item.note}
                                                   id={item.id}
                                                   key={item.id.toString()} />)}</ul>;
        } else {
          return <ul className='list-zone'><li><p>Нет зон безопасности</p></li></ul>;
        }
    }
  });

  return List;
});
