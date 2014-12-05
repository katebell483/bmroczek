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
			Slideshow.showDetail(e);
		});

        // add active state to nav after page load
		$(window).bind("load", function() {
			$(".current_page_item").css("font-weight", "700").css("color", "#000");
		});

		// close pink state on button click
		$(".exit").click(function() {
			$(".overlay").fadeOut(100);
			$(".overlay").find("iframe").remove();
		});

		// get video thumbnails
		Slideshow.getVideoThumbnails();

    },

    sizeContainer: function() {
        console.log("Slideshow.sizeContainer()");

        // get widths of all articles
        var totalWidth = 0;

        $(".home .post").each(function(index) {
            $(this).find("img").load(function() {
                totalWidth += parseInt($(this).width(), 10) + 10;
                $("#content").width(totalWidth);
        		$(this).fadeTo(600 , 1);
            });
            

        });

    },

    center: function(e) {
		console.log("center");

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

	showDetail: function(e) {
		console.log("showDetail");

		var target = $(e.target),
			overlay = $(".overlay"),
			overlayImg = overlay.find(".main-img"),
			wrapperWidth = Math.ceil(target.width() * overlayImg.height()/target.height()),
			film = target.parent().hasClass("category-video");

		// if iframe, then show that. otherwise show img
		if(film) {
			title = target.siblings("h1").text();
			var iframe = "<iframe src='//player.vimeo.com/video/" + title + "?title=0&amp;byline=0&amp;portrait=0;autoplay=1' width='978' height='550' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen autoplay></iframe>"
			overlay.find(".wrapper").prepend(iframe);	
			overlay.find(".wrapper h1").text("");		
			overlay.find(".wrapper").height(550);
		} else {
			title = target.parent().parent().siblings("h1").text();
			if(title.length <= 1) title = "";
			overlay.find(".wrapper h1").text(title);		
			overlayImg.attr("src", (target.attr("src")));		
			overlay.find(".wrapper").css("width", (wrapperWidth));		
		}

		overlay.fadeIn(200);	
	},

	getVideoThumbnails: function() {
		console.log("getVideoThumbnails");

		var totalWidth = 0;

		$(".page-id-66 .post").each(function() {
			var curPost = $(this),
				id = $(this).find("h1").text(),
				dataUrl = "http://vimeo.com/api/v2/video/" + id + ".json";

			id = id.trim();
			
			if($.isNumeric(id)) {
				console.log(id);	
				$.getJSON(dataUrl, function(result) {
					// get thumbnail
					var src = result[0]["thumbnail_large"];
					
					// calc new width based on old aspect ratio
					var width = (parseInt(result[0]["width"],10) * 450) / parseInt(result[0]["height"], 10);  
					
					// prepend thumbnail
					curPost.prepend('<img class="thumbnail" src=' + src +' />');
					
					// fade in post
        			curPost.fadeTo(600 , 1);

					// add adjusted width to container
					totalWidth += width + 15;
					$("#content").width(totalWidth);
				});
			} else {
				$(this).hide();
			}
		});
	}

}



//Slideshow.init();
