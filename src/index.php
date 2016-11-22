<?php header('Content-type: text/html; charset=UTF-8'); ?>
<!DOCTYPE html>
<html>
    <head>
        <title>InDriverCopy</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <link href="asset/css/main.css" type="text/css" rel="stylesheet" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-BLqmxD2e02-BpXmG5McwKx6P1sH4nC4&libraries=places"></script>
        <script type="text/javascript" src="asset/js/vendor/hammer.min.js"></script>
        <script type="text/javascript" src="asset/js/main.js"></script>

    </head>
    <body>
        <div class="menu menu--closed">
            <div data-click="edit_profile" class="menu__desc">
                <img src="asset/images/no_avatar.png" alt="guest" class="menu__desc_avatar" />
                <div class="menu__desc_info">
                    <span class="jq_my_name"></span><br />
                    <span class="jq_my_phone"></span>
                </div>
            </div>
            <div class="menu__response"></div>
        </div>
        <header class="header">
            <div class="header__wrapper">
                <div class="header__burger">
                    <i class="icon-menu" data-click="menu-burger"></i>
                    <i class="icon-left" data-click="back-burger"></i>
                </div>
                <div class="header__title"></div>
                <div class="header__toggle"></div>
                <div class="header__link"></div>
            </div>
        </header>
        <main class="content"></main>
        <div class="loading"></div>
    </body>
</html>
