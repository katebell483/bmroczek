<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'wordpress');

/** MySQL database password */
define('DB_PASSWORD', 'newnewla2014');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/** Enable W3 Total Cache */
define('WP_CACHE', true); // Added by W3 Total Cache

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'nyZywc|Mr7VUB^f7>]5GiZ|8ZAyR?(4Q;R,-oM:UX$1La0h#z/vM!z;Drut%0(-_');
define('SECURE_AUTH_KEY',  'L-t>gn1,4Fv1#i:d]H;F5rry--f_-x00T@_9j|^`7 B->c)|:g(BwIir7L*X0X ?');
define('LOGGED_IN_KEY',    'Gx^CN+;L.2)!G*/>v!52_G>v6.!0TM &L&8Z3$VV00f+o*^u9t|+|.wD?~FCd`xB');
define('NONCE_KEY',        'z^/*]MnGVYN6ut=(cBxr8ZxtVYwJKLMdg5tRT47zH*)3hA8+O^a-cpxeV!vC%A|%');
define('AUTH_SALT',        '+kzfZ<Hy2QVz4&}^!5!y,>Br]E.cHX&z=>gY_7Dj$u:yKU&haRtkmc=R.fT dh28');
define('SECURE_AUTH_SALT', 'xOgNNVztu:WXRGNaK|r#-SY-3Ge!;y>M+@_-mD+k}$]nH+|hr+x~Ebbo>=Ww-_b|');
define('LOGGED_IN_SALT',   '$Nwc~OZyOk6!N&?dTzGnBs7h[TxiJ+eY>8#E8Q7-7% Q6-U23?7+Ye:0w!St*e)<');
define('NONCE_SALT',       '#37l f+uqGo<}{0QveZW|g3{8Oef_|Hk0-_jg};IHI.HKnmX3v+cM5y:fLiQX=*Z');
/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
define('WP_ALLOW_REPAIR', true);
