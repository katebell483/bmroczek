<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width; initial-scale=1; maximum-scale=1">
	<title><?php wp_title( ' | ', true, 'right' ); ?></title>
	<link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_uri(); ?>" />
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/scripts/libs/jquery.color-2.1.2.js"></script>
	<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/scripts/libs/fastclick.js"></script>
	<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/scripts/libs/froogaloop.min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/scripts/slideshow.js"></script>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

	<div class="overlay">
		<div class="wrapper">
			<img class="main-img" src=''/>
			<img class="exit" src="<?php bloginfo('template_url'); ?>/img/exit.png"/>
		</div>
	</div>

	<div id="wrapper" class="hfeed">

		<header id="header" role="banner">

			<section id="branding">
				
				<div id="site-title">
					<?php if ( ! is_singular() ) { echo '<h1>'; } ?>
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php esc_attr_e( get_bloginfo( 'name' ), 'blankslate' ); ?>" rel="home"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></a>
					<?php if ( ! is_singular() ) { echo '</h1>'; } ?>
					<!--<h1 id="site-subtitle">hair stylist</h1>-->
				</div>
				
				<!--<div id="site-description"><?php bloginfo( 'description' ); ?></div>-->

			</section>


			<nav id="menu" class="nav" role="navigation">
			<?php wp_nav_menu( array( 'theme_location' => 'main-menu' ) ); ?>
			</nav>

		</header>

	<div id="container">
