<?php

class Birchschedule_View_Services_Imp {

	private function __construct() {
		
	}

	static function init() {
		global $birchschedule;

        $package = $birchschedule->view->services;
		add_action('admin_init', array($package, 'wp_admin_init'));
        add_action('init', array($package, 'wp_init'));
    }

    static function wp_init() {
        self::register_post_type();
    }


	static function wp_admin_init() {
        global $birchschedule;
        
        $package = $birchschedule->view->services;
        add_filter('manage_edit-birs_service_columns', array($package, 'get_edit_columns'));
        add_action('manage_birs_service_posts_custom_column', array($package, 'render_custom_columns'), 2);
	}

	static function register_post_type() {
        register_post_type('birs_service', array(
            'labels' => array(
                'name' => __('Services', 'birchschedule'),
                'singular_name' => __('Service', 'birchschedule'),
                'add_new' => __('Add Service', 'birchschedule'),
                'add_new_item' => __('Add New Service', 'birchschedule'),
                'edit' => __('Edit', 'birchschedule'),
                'edit_item' => __('Edit Service', 'birchschedule'),
                'new_item' => __('New Service', 'birchschedule'),
                'view' => __('View Service', 'birchschedule'),
                'view_item' => __('View Service', 'birchschedule'),
                'search_items' => __('Search Services', 'birchschedule'),
                'not_found' => __('No Services found', 'birchschedule'),
                'not_found_in_trash' => __('No Services found in trash', 'birchschedule'),
                'parent' => __('Parent Service', 'birchschedule')
            ),
            'description' => __('This is where services are stored.', 'birchschedule'),
            'public' => false,
            'show_ui' => true,
            'capability_type' => 'birs_service',
            'map_meta_cap' => true,
            'publicly_queryable' => false,
            'exclude_from_search' => true,
            'show_in_menu' => 'edit.php?post_type=birs_appointment',
            'hierarchical' => false,
            'show_in_nav_menus' => false,
            'rewrite' => false,
            'query_var' => true,
            'supports' => array('title', 'editor'),
            'has_archive' => false
            )
        );
	}

    static function get_edit_columns($columns) {
        $columns = array();

        $columns["cb"] = "<input type=\"checkbox\" />";
        $columns["title"] = __("Service Name", 'birchschedule');
        $columns["description"] = __("Description", 'birchschedule');
        return $columns;
    }

    static function render_custom_columns($column) {
        global $post;

        if ($column == 'description') {
            the_content();
            return;
        }
        $value = get_post_meta($post->ID, '_' . $column, true);

        echo $value;
    }

    static function load_page_edit_birs_service($arg) {
        birch_assert(is_array($arg) && isset($arg['post_type']) && 
            $arg['post_type'] == 'birs_service');
        
        global $birchschedule;

        $package = $birchschedule->view->services;
        add_action('add_meta_boxes', array($package, 'add_meta_boxes'));
        add_filter('post_updated_messages', array($package, 'get_updated_messages'));
    }

    static function enqueue_scripts_edit_birs_service($arg) {
        birch_assert(is_array($arg) && isset($arg['post_type']) && 
            $arg['post_type'] == 'birs_service');

        global $birchschedule;

        $birchschedule->view->register_3rd_scripts();
        $birchschedule->view->register_3rd_styles();
        $birchschedule->view->enqueue_scripts(
            array(
                'birchschedule_view_services_edit', 'birchschedule_model',
                'birchschedule_view_admincommon', 'birchschedule_view'
            )
        );
        $birchschedule->view->enqueue_styles(array('birchschedule_admincommon', 
            'birchschedule_services_edit'));
    }

    static function add_meta_boxes() {
        global $birchschedule;

        $package = $birchschedule->view->services;
        remove_meta_box('slugdiv', 'birs_service', 'normal');
        remove_meta_box('postcustom', 'birs_service', 'normal');
        add_meta_box('birchschedule-service-info', __('Service Settings', 'birchschedule'), 
            array($package, 'render_service_info'), 'birs_service', 'normal', 'high');
        add_meta_box('birchschedule-service-staff', __('Providers', 'birchschedule'), 
            array($package, 'render_assign_staff'), 'birs_service', 'side', 'default');
    }

    static function get_updated_messages($messages) {
        global $post, $post_ID;

        $messages['birs_service'] = array(
            0 => '', // Unused. Messages start at index 1.
            1 => __('Service updated.', 'birchschedule'),
            2 => __('Custom field updated.', 'birchschedule'),
            3 => __('Custom field deleted.', 'birchschedule'),
            4 => __('Service updated.', 'birchschedule'),
            5 => isset($_GET['revision']) ? sprintf(__('Service restored to revision from %s', 'birchschedule'), wp_post_revision_title((int) $_GET['revision'], false)) : false,
            6 => __('Service updated.', 'birchschedule'),
            7 => __('Service saved.', 'birchschedule'),
            8 => __('Service submitted.', 'birchschedule'),
            9 => sprintf(__('Service scheduled for: <strong>%1$s</strong>.', 'birchschedule'), date_i18n('M j, Y @ G:i', strtotime($post->post_date))),
            10 => __('Service draft updated.', 'birchschedule')
        );

        return $messages;
    }

    static function get_length_types() {
        return array(
                'minutes' => __('minutes', 'birchschedule'),
                'hours' => __('hours', 'birchschedule')
            );
    }

    static function get_padding_types() {
        return array(
                'before' => __('Before', 'birchschedule'),
                'after' => __('After', 'birchschedule'),
                'before-and-after' => __('Before & After', 'birchschedule')
            );
    }

    static function get_price_types() {
        return array(
                'fixed' => __('Fixed', 'birchschedule'),
                'varies' => __('Varies', 'birchschedule'),
            );
    }

    static function save_service($post) {
        birch_assert(is_array($post) && isset($post['post_type']) && 
            $post['post_type'] == 'birs_service');

        global $birchschedule;
        $config = array(
            'base_keys' => array(),
            'meta_keys' => array(
                '_birs_service_length', '_birs_service_length_type',
                '_birs_service_padding', '_birs_service_padding_type',
                '_birs_service_price', '_birs_service_price_type',
                '_birs_assigned_staff'
            )
        );
        $service_data = 
            $birchschedule->view->merge_request($post, $config, $_POST);
        if(!isset($_POST['birs_assigned_staff'])) {
            $service_data['_birs_assigned_staff'] = array();
        }
        $birchschedule->model->save($service_data, $config);
        $birchschedule->model->update_model_relations($post['ID'], '_birs_assigned_staff',
            'birs_staff', '_birs_assigned_services');
        $birchschedule->model->booking->async_recheck_fully_booked_days();
    }

    static function render_service_info($post) {
        global $birchschedule, $birchpress;

        $package = $birchschedule->view->services;
        $post_id = $post->ID;
        $length = get_post_meta($post_id, '_birs_service_length', true);
        $length_type = get_post_meta($post_id, '_birs_service_length_type', true);
        $padding = get_post_meta($post_id, '_birs_service_padding', true);
        $padding_type = get_post_meta($post_id, '_birs_service_padding_type', true);
        $price = get_post_meta($post_id, '_birs_service_price', true);
        $price_type = get_post_meta($post_id, '_birs_service_price_type', true);
        ?>
        <div class="panel-wrap birchschedule">
            <table class="form-table">
                <tr class="form-field">
                    <th><label><?php _e('Length', 'birchschedule'); ?> </label>
                    </th>
                    <td>
                        <input type="text" name="birs_service_length"
                               id="birs_service_length" value="<?php echo $length; ?>"> 
                       <select name="birs_service_length_type">
                           <?php $birchpress->util->render_html_options($package->get_length_types(), $length_type); ?>
                        </select>
                    </td>
                </tr>
                <tr class="form-field">
                    <th><label><?php _e('Padding', 'birchschedule'); ?> </label>
                    </th>
                    <td><input type="text" name="birs_service_padding"
                               id="birs_service_padding" value="<?php echo $padding; ?>"> <span><?php echo _e('mins padding time', 'birchschedule'); ?>
                        </span> <select name="birs_service_padding_type">
                            <?php $birchpress->util->render_html_options($package->get_padding_types(), $padding_type) ?>
                        </select>
                    </td>
                </tr>
                <tr class="form-field">
                    <th><label><?php echo apply_filters('birchschedule_price_label', __('Price', 'birchschedule')); ?> </label></th>
                    <td><select name="birs_service_price_type" id="birs_service_price_type">
                            <?php $birchpress->util->render_html_options($package->get_price_types(), $price_type); ?>
                        </select> 
                        <input type="text" 
                               name="birs_service_price" id="birs_service_price" value="<?php echo $price; ?>">
                    </td>
                </tr>
            </table>
        </div>
        <?php
    }

    static function render_staff_checkboxes($staff, $assigned_staff) {
        foreach ($staff as $thestaff) {
            if (array_key_exists($thestaff->ID, $assigned_staff)) {
                $checked = 'checked="checked"';
            } else {
                $checked = '';
            }
            echo '<li><label>' .
            "<input type=\"checkbox\" " .
            "name=\"birs_assigned_staff[$thestaff->ID]\" $checked >" .
            $thestaff->post_title .
            '</label></li>';
        }
    }

    static function render_assign_staff($post) {
        $staff = get_posts(
                array(
                    'post_type' => 'birs_staff',
                    'nopaging' => true
                )
        );
        $assigned_staff = get_post_meta($post->ID, '_birs_assigned_staff', true);
        $assigned_staff = unserialize($assigned_staff);
        if ($assigned_staff === false) {
            $assigned_staff = array();
        }
        ?>
        <div class="panel-wrap birchschedule">
            <?php if (sizeof($staff) > 0): ?>
                <p><?php _e('Assign providers that can perform this service:', 'birchschedule'); ?></p>
                <div><ul>
                        <?php self::render_staff_checkboxes($staff, $assigned_staff); ?>
                    </ul></div>
            <?php else: ?>
                <p>
                    <?php
                    printf(__('There is no providers to assign. Click %s here %s to add one.', 'birchschedule'), '<a
                        href="post-new.php?post_type=birs_staff">', '</a>');
                    ?>
                </p>
            <?php endif; ?>
        </div>
        <?php
    }

}