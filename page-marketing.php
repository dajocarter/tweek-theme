<?php 

/*
 * Template Name: Standard Marketing Page
 */

get_header(); the_post(); ?>

<main role="main">

<?php
if( have_rows('layout') ) {
  while ( have_rows('layout') ) { the_row();
    if( get_row_layout() === 'hero_unit' ) { ?>

      <section class="hero-unit">
        <?php scratch_sub_image_start('image'); ?>
          <div class="overlay clearfix">
            <?php
              if(get_sub_field('text_align') === 'Left') {
                $text_align_class = 'left';
              } elseif(get_sub_field('text_align') === 'Right') {
                $text_align_class = 'right';
              } else {
                $text_align_class = 'center';
              }
            ?>
            <figcaption class="wrap <?php echo $text_align_class; ?> hpad clearfix white">
              <div class="content">
                <?php
                  scratch_sub_field('header', 'h2');
                  scratch_sub_field('blurb');
                  scratch_sub_button('cta_link', 'cta_text');
                ?>
              </div>
            </figcaption>
          </div>
        <?php scratch_sub_image_end('image'); ?>
      </section>

    <?php
    } elseif( get_row_layout() === 'flexible_columns' ) {
    ?>

      <section class="flexible-columns vpad-3x">
        <div class="wrap hpad clearfix center">
          <?php
            scratch_sub_field('header', 'h2');
            scratch_sub_field('blurb');
            if(get_sub_field('use_custom_columns')) {
              $columns = 'custom';
            } else {
              $columns = 4;
            }
            scratch_sub_layout_declare('columns', $columns);
            while(has_sub_field('columns')) {
              scratch_layout_start();
                scratch_sub_link_start('link', 'header');
                  scratch_sub_icon_circle('icon');
                  scratch_sub_field('header', 'h4');
                scratch_sub_link_end('link');
                scratch_sub_field('blurb');
              scratch_layout_end();
            }
            scratch_sub_button('cta_link', 'cta_text');
          ?>
        </div>
      </section>
  
    <?php
    } elseif( get_row_layout() === 'staggered_images_with_text' ) {
    ?>
  
      <section class="staggered vpad-3x">
        <?php while(has_sub_field('rows')) { ?>
          <div class="row vpad-2x">
            <div class="wrap hpad clearfix">
              <div class="fivecol first">
                <?php
                  scratch_sub_image_start('image', 'circle valign');
                  scratch_sub_image_end('image');
                ?>
              </div>
              <div class="sevencol last">
                <div class="content valign">
                  <?php
                    scratch_sub_field('header', 'h3');
                    scratch_sub_field('blurb');
                    scratch_sub_button('cta_link', 'cta_text');
                  ?>
                </div>
              </div>
            </div>
          </div>
        <?php } ?>
      </section>
  
    <?php
    } elseif( get_row_layout() === 'slider' ) {
    ?>
  
      <section class="slider-row">
        <div class="wrap hpad vpad-gap clearfix">
          <?php if(get_sub_field('slides')) { ?>
            <div class="slider clearfix">
              <ul class="slides">
                <?php while(has_sub_field('slides')) { ?>
                  <li class="slide"
                      style="background-image: url('<?php the_sub_field('background'); ?>');">
                    <div class="overlay clearfix">
                      <div class="slide-text center valign-always">
                        <?php
                          scratch_sub_field('header', 'h3');
                          scratch_sub_field('blurb');
                          scratch_sub_button('cta_link', 'cta_text');
                        ?>
                      </div>
                    </div>
                  </li>
                <?php } ?>
              </ul>
            </div>
          <?php } ?>
        </div>
      </section>

    <?php
    } elseif( get_row_layout() === 'wysiwygs' ) {
    ?>
  
      <section class="wysiwygs">
        <div class="wrap hpad clearfix">
          <h2 class="center">
            <?php scratch_sub_field('header'); ?>
          </h2>
          <?php
            if(get_sub_field('offset') !== 'Flexible') {
              if(get_sub_field('offset') === '2 to 1') {
                $offset = '2:1';
              } else {
                $offset = '1:2';
              }
            } else {
              $offset = null;
            }
            scratch_sub_layout_declare('wysiwygs', 2, $offset);
            while(has_sub_field('wysiwygs')) {
              scratch_layout_start();
                scratch_sub_field('wysiwyg');
              scratch_layout_end();
            }
          ?>
        </div>
      </section>

    <?php 
    }
    ?>

  <?php 
  }
  ?>

<?php 
} else { 
?>

<?php 
}
?>

</main>

<?php get_footer(); ?>