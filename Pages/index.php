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
            <div class="container col-9 text-center" id="site-content">
                <!--Site-content-->
                <h1> Finest Selection </h1>
                <div id="gameDisplayBox" class="w-100">
                    <div class="gameCollumn w-100 d-flex mt-4">
                        <div class="container w-25 bg-secondary thumbnail"> <h3> BossCock </h3><img src="../Resources/thumbnail1.png" class="mb-3" alt="Game 1"/> </div>
                        <div class="container w-25 bg-secondary thumbnail"> <img src="#" alt="Game 2"/> </div>
                        <div class="container w-25 bg-secondary thumbnail"> <img src="#" alt="Game 3"/> </div>
                    </div>

                    <div class="gameCollumn w-100 d-flex mt-4">
                        <div class="container w-25 bg-secondary"> <img src="#" alt="Game 4"/> </div>
                        <div class="container w-25 bg-secondary"> <img src="#" alt="Game 5"/> </div>
                        <div class="container w-25 bg-secondary"> <img src="#" alt="Game 6"/> </div>
                    </div>

                    <div class="gameCollumn w-100 d-flex mt-4">
                        <div class="container w-25 bg-secondary"> <img src="#" alt="Game 7"/> </div>
                        <div class="container w-25 bg-secondary"> <img src="#" alt="Game 8"/> </div>
                        <div class="container w-25 bg-secondary"> <img src="#" alt="Game 9"/> </div>
                    </div>
                <div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <!--Footer-->
                <?php require ('./Components/footer.html')?>
            </div>
        </div>
    </body>
</html>