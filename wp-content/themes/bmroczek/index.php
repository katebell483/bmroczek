<?php get_header(); ?>
<section id="content" role="main">
<?php
	if (is_home()) {
		query_posts("cat=-6");
	}
?>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<?php get_template_part( 'entry' ); ?>
<?php endwhile; endif; ?>
</section>
<?php get_footer(); ?>
