<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'neweb138_wp796');

/** MySQL database username */
define('DB_USER', 'neweb138_bdlive');

/** MySQL database password */
define('DB_PASSWORD', 'g{}a?cRwU9*K');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '6brqdtu6x4zcd5drvnnotyxqdppbgx1w4ztsztl4hvxbhqq9tzli0adi1em9jf8n');
define('SECURE_AUTH_KEY',  'ylfemltrjdqqnrzzrwqfxgwbqelxmnyfb0ldhuzg6vttdrshyz8aaebj5twsnbhg');
define('LOGGED_IN_KEY',    'dmucwhx7sgjfeq2m6lbw04nkghqa5le0k2ibvceld2cvk11uga3cf4naceik5ntm');
define('NONCE_KEY',        'rkovein4zvzuc3glzmdkuevmlrnrzg259ccskjz6fyffivcmdtftebmsnhz2n3ss');
define('AUTH_SALT',        '5qwpfuu5q1i2trarw614w9prervduhjzsorv8dy7x3zhkkchuloz98vyknzse3zl');
define('SECURE_AUTH_SALT', '1348ah4jbulobghghenpwp75qq6johwgikze32g1evxsealszzxbohet420vvi3u');
define('LOGGED_IN_SALT',   'vbhfu8qfbofmi2pfh1q6e30u8vhax1uuz8vybfonmcess4owq3l7ugisu5xjybbp');
define('NONCE_SALT',       'eobvugfby8tgv94pih3m96yzf69axjk9gxkkklwzv07phlyn5kfugylhvfwireb3');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wplk_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', true);
define('WP_DEBUG_DISPLAY', false);
define('WP_DEBUG_LOG', true);
define( 'WP_MEMORY_LIMIT', '128M' );

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

# Disables all core updates. Added by SiteGround Autoupdate:
define( 'WP_AUTO_UPDATE_CORE', false );
