/* global User */

define(['react'], function(React) {
    
  var ListItem = React.createClass({
    getInitialState: function() {
        var photo  = this.props.photo || User.default_avatar,
            name   = this.props.name || User.default_name,
            id     = this.props.id,
            remove = 'remove-' + this.props.remove;
        
      return {photo: photo, name : name, id : id, remove: remove};
    },

      render: function() {
            return <li className='list-favorites__fav'>
                    <div className='list-favorites__fav__photo'>
                      <img src={this.state.photo} />
                    </div>
                    <div className='list-favorites__fav__desc'>
                       {this.state.name}
                    </div>
                    <div className='list-favorites__fav__action'>
                      <i className='icon-cancel-circled' data-click={this.state.remove} data-id={this.state.id} />
                    </div>
                  </li>;
            }
  });
  
  
  var List = React.createClass({
    getInitialState: function() {
        return {data: this.props.data};
    },
    
    componentWillReceiveProps: function() {
        this.setState({data: this.props.data});
    },
    
    
    render: function() {
        var data = this.state.data,
            list = data.list,
            emptyText = data.emptyText,
            remove = data.remove;
        
        if (list.length > 0) {
          return <ul>{list.map((item) => <ListItem name={item.name} 
                                                   photo={item.photo}
                                                   id={item.id}
                                                   remove={remove}
                                                   key={item.id.toString()} />)}</ul>;
        } else {
          return <ul><li><p>{emptyText}</p></li></ul>;
        }
    }
  });

  return List;
});
