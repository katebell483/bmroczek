<?php get_header(); ?>
<section id="content" role="main">

<!--add film posts to film page-->
<?php 
	if(is_page('film')) {
		query_posts('cat=4');
	}
?>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
<section class="entry-content">
<?php the_content(); ?>
<div class="entry-links"><?php wp_link_pages(); ?></div>
</section>
</article>
<?php endwhile; endif; ?>
</section>
<?php get_footer(); ?>
