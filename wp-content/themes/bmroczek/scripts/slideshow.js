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
  
		// scale viewport
		Slideshow.scaleViewport();

		// if ipad, add ipad styles
		if (navigator.userAgent.match(/iPad/i)) {
			Slideshow.addIPadstyles();     
 		}

		// on click of post, show highlighted state
		$(".post").click(function(e) {
			Slideshow.showDetail(e);
		});

		// close pink state on button click
		$(".exit").click(function() {
			$(".overlay").fadeOut(100);
			$(".overlay").find("iframe").remove();
		});
	
		// fade in bio page
		$(".page-id-6 p").each(function(index) {
        	$(this).fadeTo(300 , 1);
        });
		
		// fade in contact page
		$(".page-id-22 p").each(function(index) {
        	$(this).fadeTo(300 , 1);
        });
		
		// fade in appointments page
		$(".page-id-20 p").each(function(index) {
        	$(this).fadeTo(300 , 1);
        });

		// get video thumbnails
		Slideshow.getVideoThumbnails();
		
		// add fastclick for mobile
		$(function() {
			FastClick.attach(document.body);
		});
    },

    sizeContainer: function() {
        console.log("Slideshow.sizeContainer()");

        // get widths of all articles
        var totalWidth = 0;

        $(".home .post").each(function(index) {
            $(this).find("img").load(function() {
                totalWidth += parseInt($(this).width(), 10) + 5;
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

	showPhoneDetail: function(target) {
		console.log("showPhoneDetail");

		film = target.parent().hasClass("category-video"),
		title = target.parent().parent().siblings("h1").text();
		
		if(film) {

			// remove existing iframes and add any missing thumbnails		
			$("iframe").remove();	
			$(".thumbnail").show();

			id = target.siblings(".entry-content").find("p").text();

			var iframeHtml = "<iframe id='player1' src='//player.vimeo.com/video/" + id + "?api=1' width='100%' height='190' frameborder='0'></iframe>"
			target.parent().append(iframeHtml);
			target.hide();
		
		} else {
			if(title.length <= 1) {
				$(".post h1").hide();
			};
		}


	},

	showDetail: function(e) {
		console.log("showDetail");

		var target = $(e.target),
			overlay = $(".overlay"),
			overlayImg = overlay.find(".main-img"),
			wrapperWidth = Math.ceil(target.width() * overlayImg.height()/target.height()),
			film = target.parent().hasClass("category-video"),
			title = target.parent().parent().siblings("h1").text();


		if(navigator.userAgent.match(/iPhone/i)) {
			Slideshow.showPhoneDetail(target);
			return;
		}

		// if iframe, then show that. otherwise show img
		if(film) {

			id = target.siblings(".entry-content").find("p").text();
		
			if (navigator.userAgent.match(/iPad/i)) {

				var iframe = "<iframe src='//player.vimeo.com/video/" + id + "?title=0&amp;byline=0&amp;portrait=0;autoplay=1' width='700' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen autoplay></iframe>"
				$(".wrapper").height(550);	

			} else {

				$(".wrapper").height(550);
				var iframe = "<iframe src='//player.vimeo.com/video/" + id + "?title=0&amp;byline=0&amp;portrait=0;autoplay=1' width='978' height='550' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen autoplay></iframe>"

			}
			overlay.find(".wrapper").prepend(iframe);	

		} else {
			if(title.length <= 1) title = "";
			overlay.find(".wrapper h1").text(title);
			
			// size differently for landscalpe and ipad
			if(target.height() < target.width() && navigator.userAgent.match(/ipad/i)) {	
				$(".overlay .wrapper .main-img").width("100%").height("auto");			
				$(".overlay .wrapper").width("80%").css("max-width", "80%").css("max-height", "85%");			
			} else if(navigator.userAgent.match(/ipad/i)) {
				$(".overlay .wrapper .main-img").height(550).width(target.width() * 550/target.height());			
				$(".overlay .wrapper").width(target.width() * 550/target.height());			
			} else {
				overlay.find(".wrapper").css("width", (wrapperWidth));		
			}

			overlayImg.attr("src", (target.attr("src")));		
		}

		overlay.fadeIn(300);	
	},

	getVideoThumbnails: function() {
		console.log("getVideoThumbnails");

		var totalWidth = 0;

		$(".page-id-66 .post").each(function() {
			var curPost = $(this),
				id = curPost.find(".entry-content p").text(),
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
	},

	scaleViewport: function() {
		console.log("scaleViewport");

		// only scale for ipad
		if (navigator.userAgent.match(/iPad/i)) {
			var viewportmeta = document.querySelector('meta[name="viewport"]');
			if (viewportmeta) {
				viewportmeta.content = 'width=device-width, minimum-scale=0.95, maximum-scale=0.95, initial-scale=0.95';
				document.body.addEventListener('gesturestart', function () {
					viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=0.95';
				}, false);
			}

		}

	},

	addIPadstyles: function() {
		console.log("addIPadStyles");
		$("#container").css("overflow-y","scroll").css("-webkit-overflow-scrolling", "touch");
		$("#content").css("overflow-y","scroll").css("-webkit-overflow-scrolling", "touch");
	}

}



//Slideshow.init();
