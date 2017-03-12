/* global Event */

define(['Dom', 'Funcs', 'domReady'], function (Dom, Funcs, domReady) {
  var el_top;
  
  function addNewEvents(event) {
    var target = event.target,
        el,
        prev;

    while (target !== this) {
      if (target) {
        if (target.dataset.click === "drop-down") {
          el = target;
          prev = el.previousSibling;

          prev.classList.add('hidden-forms');
          el.classList.remove('drop-down');
          el.classList.add('drop-up');
          el.dataset.click = 'drop-up';

          el.style.top = 12 + 'px';

          break;
        }

        if (target.dataset.click === "drop-up") {
          el = target;
          prev = el.previousSibling;

          prev.classList.remove('hidden-forms');
          el.classList.add('drop-down');
          el.classList.remove('drop-up');
          el.dataset.click = 'drop-down';

          el.style.top = el_top;

          break;
        }
      }

      if (target) {
        target = target.parentNode;
      } else {
        break;
      }
    }
  }

  var HideForms = {
    init: function() {
      domReady(function () {
        var bottom_block = Dom.sel('div[data-hide-form=bottom]'),
            parent_block = Dom.sel('[data-hide-form=enable]'),
            top_block = Dom.sel('[data-hide-form=top]'),
            height_bottom_block,
            coords_bottom_block,
            el,
            height_parent,
            winHeight = window.innerHeight;

        if (bottom_block) {
          //if (top_block) {
          //  coords_bottom_block = top_block.getBoundingClientRect().bottom;
          //} else {
          coords_bottom_block = bottom_block.getBoundingClientRect().top;
          //}
          height_bottom_block = Funcs.outerHeight(bottom_block);
          ////bottom_block.style.bottom = '-' + (winHeight - coords_bottom_block - height_bottom_block - 26) + 'px';
        }

        if (parent_block) {
          var target_block = parent_block;
          el = document.createElement('div');
          el.className += 'drop-down';
          el.dataset.click = 'drop-down';
          
          if (top_block) {
            target_block = top_block;
          }
          
          target_block.parentNode.insertBefore(el, target_block.nextSibling);

          height_parent = Funcs.outerHeight(target_block);
          el_top = el.style.top;
          if (bottom_block) {
            var drop_coords = el.getBoundingClientRect();
            
            el_top = '-' + ((drop_coords.top - winHeight) + height_bottom_block + 55) + 'px';
            ////el.style.top = el_top;
          }
        }

      Dom.sel('.content').addEventListener('click', addNewEvents);

      });
    },
    
    clear: function () {
      Dom.sel('.content').removeEventListener('click', addNewEvents);
    }
  };
  
  return HideForms;


});