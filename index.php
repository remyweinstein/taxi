<!DOCTYPE html>
<html>
    <head>
        <title>InDriverCopy</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <link href="css/main.css" type="text/css" rel="stylesheet" />
        <script type="text/javascript" src="js/vendor/hammer.min.js"></script>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-BLqmxD2e02-BpXmG5McwKx6P1sH4nC4"></script>
    </head>
    <body>
        <div class="menu menu--closed">
            <div data-click="edit_profile" class="menu__desc">
                <img src="images/no_avatar.png" alt="" class="menu__desc_avatar" />
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
                    <i class="icon-menu"></i>
                </div>
                <div class="header__title"></div>
                <div class="header__toggle"></div>
                <div class="header__link">
                    <i class="icon-share"></i>
                </div>
            </div>
        </header>
        <main class="content"></main>
        <div class="loading"></div>
        <script type="text/javascript" src="js/app.js"></script>
        <!--<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-BLqmxD2e02-BpXmG5McwKx6P1sH4nC4&libraries=places&callback=initAutocomplete" async defer></script>-->
    </body>
</html>
