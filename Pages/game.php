<!DOCTYPE html>
<html>
    <?php require ('./Components/head.html'); ?> 
    <body>
        <?php require ('./Components/navbar.html'); ?>
        <div class="row">
            <div class="container col-3">
                <!--Sidebar-->
                <?php require ('./Components/sidebar.html')?>
            </div>
            <div class="container col-9" id="site-content">
                <!--Site-content-->
                <div id="canvasAnchor" class="mt-5 d-flex justify-content-center"></div>
                <div id="soundtrack"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <!--Footer-->
                <?php require ('./Components/footer.html')?>
            </div>
        </div>
        <script src="../examples/pixiexample/js/pixi.min.js"></script>
        <script src="../examples/pixiexample/js/pixiexample.js"></script>
        <script src="../examples/pixiexample/js/keysexample.js"></script>
    </body>
</html>