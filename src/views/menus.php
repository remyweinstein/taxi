<?php
  function call_menu($controller) {
    require_once('views/menus/'.$controller.'.php');
    }
  
  call_menu($controller);
  