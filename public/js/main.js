(function ($) {
  let myForm = $('#search');
  let input = $('#Term');
  let inputtype = $('#dropdown');
  let table = $('#songs-table');

  function bindEventsToTodoItem(table) {
    
    let ajaxurl = '';
    if (inputtype.val() == 'Song') { 
      ajaxurl = '/songs/searchsong/' + input.val();
    }
    if (inputtype.val() == 'Artist') { 
      ajaxurl = '/songs/searchartist/' + input.val();
    }
    if (inputtype.val() == 'Genre') { 
      ajaxurl = '/songs/searchgenre/' + input.val();
    }
    var requestConfig = {
      method: 'POST',
      url: ajaxurl
    };

  function bindEventsToTodoItem(todoItem) {
    todoItem.find('.finishItem').on('click', function (event) {
      event.preventDefault();
      var currentLink = $(this);
      var currentId = currentLink.data('id');

      var requestConfig = {
        method: 'POST',
        url: '/api/todo/complete/' + currentId
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        var newElement = $(responseMessage);
        bindEventsToTodoItem(newElement);
        todoItem.replaceWith(newElement);
      });
    });
  }

    
  table.children().each(function (index, element) {
    bindEventsToTodoItem($(element));
  });
  };

})(window.jQuery);

