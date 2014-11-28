var Slideshow = {

    DEBUG: true,
    
    MOUSESIDE: "",

    scrollLoop: false,
    SCROLL_LOOP_DELAY: 150,
    

    init: function() {
        console.log("Slideshow.init()");
        // kill all debug
        if (!Slideshow.DEBUG) {
            console.log = function() {};
            console.warn = function() {};
            console.debug = function() {};
            console.info = function() {};
        };

        // size container
        Slideshow.sizeContainer();
        
        $("body").on('mousemove', function(e) {
            if (e.clientX < $(window).width() / 2) {
                Slideshow.MOUSESIDE = "L";
            } else {
                Slideshow.MOUSESIDE = "R";
            }
        });

        $("#content").mouseenter(function(e) {
            if(Slideshow.MOUSESIDE === 'R') {
                //$("body").animate({scrollLeft: $(this).width()}, 7000);
            } else {
                //$("body").animate({scrollLeft: 0}, 7000);
            }
        });
    
        $("#content").mouseleave(function() {
            //$("body").stop();
        });

		// on click of post, show highlighted state
		$(".post").click(function(e) {

			var target = $(e.target),
				overlay = $(".overlay"),
				overlayImg = overlay.find("img");
				wrapperWidth = Math.ceil(target.width() * overlayImg.height()/target.height());

			overlayImg.attr("src", (target.attr("src")));		
			overlay.find(".wrapper").css("width", (wrapperWidth));		
			overlay.fadeIn(300);	
	
		});

        // add active state to nav
        Slideshow.addActiveState();
        

    },


    addActiveState: function() {
        
        // get current url
        var path = window.location.pathname; // returns path only
    
        console.log(path);
        // router
        switch(path) {

            case "film":
            case "bio":
            case "appointments":
            case "contact":
            default:
                $('li:contains("portfolio")').css("font-weight", "700").css("color", "#000");
                //$('a:contains("portfolio")').css("border-bottom", "1px solid");
        }

    },

    sizeContainer: function() {
        console.log("Slideshow.sizeContainer()");

        // get widths of all articles
        var totalWidth = 0;

        $(".home .post").each(function(index) {
            $(this).find("img").load(function() {
                totalWidth += parseInt($(this).width(), 10) + 10;
                $("#content").width(totalWidth);
            });
            

        });

		$(".page-id-66 .post").each(function() {
				console.log(totalWidth);
				totalWidth += parseInt($(this).width(), 10) - 25;
				$("#content").width(totalWidth);
		});

        $("#content img").css("opacity", 1);


    },

    center: function(e) {

        // get left offset
        var offset = $(e.target).offset().left - $(window).scrollLeft();

        // get target size
        var targetW = $(e.target).width();

        // get diff needed to center
        var diff = offset - $(window).width()/2 + targetW/2 ;

        // curr margin-left
        var marginL = parseInt($("#content").css("margin-left"), 10);

        $("#content").animate({
            marginLeft:  marginL - diff + "px"
        }, 500);

    },
}

//Slideshow.init();
