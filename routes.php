<?php
$post_page = filter_input(INPUT_POST, 'page', FILTER_SANITIZE_STRING);
$post_section = filter_input(INPUT_POST, 'section', FILTER_SANITIZE_STRING);

$view = 'views/'.$post_section.'/'.$post_page.'.php';
$default_view = 'driver/city';

if(file_exists($view)) {
    require_once $view;
} else {
    if(!$post_section) {
        $post_section = 'driver';
    }
    require_once 'views/'.$default_view.'.php';
}

array_push($json_data, array('menu' => file_get_contents('views/menus/'.$post_section.'.php')));
echo json_encode($json_data);
