<?php get_header(); ?>
<section id="content" role="main">

<!--add film posts to film page-->
<?php 
if(is_page('film')) {
	query_posts('cat=-5');
}
?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<?php get_template_part( 'entry' ); ?>
<?php endwhile; endif; ?>
</section>
<?php get_footer(); ?>
