<?php
/**
 * HOMENEST HEADLESS CMS - MASTER FUNCTIONS.PHP
 * Phiên bản chuẩn đồng bộ cho Next.js 15 App Router & WordPress
 */

// 1. Mở khóa SSL nội bộ & Theme Editor loopback
add_filter('https_local_ssl_verify', '__return_false');
add_filter('https_ssl_verify', '__return_false');

if (isset($_GET['wp_scrape_key'])) {
    status_header(200);
    exit;
}

// 2. Chặn bot tìm kiếm (noindex) & Header an toàn
add_action('send_headers', function () {
    header('X-Robots-Tag: noindex, nofollow, noarchive, nosnippet', true);
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
});

// 3. Khóa truy cập trực tiếp vào wp-login.php (Chuyển về trang chủ)
add_action('login_init', function () {
    if (isset($_GET['action']) && $_GET['action'] === 'logout') {
        return;
    }
    wp_safe_redirect(home_url('/'));
    exit;
});

// 4. Mở CORS an toàn cho Frontend
add_action('init', function () {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Api-Key, X-GraphQL-Secret, X-Secret-Key");
});

// 5. Tắt XML-RPC, RSS Feed và Ẩn phiên bản WordPress
add_filter('xmlrpc_enabled', '__return_false');
add_filter('xmlrpc_methods', function () { return []; });
remove_action('wp_head', 'wp_generator');

add_action('do_feed', 'hn_disable_feed', 1);
add_action('do_feed_rdf', 'hn_disable_feed', 1);
add_action('do_feed_rss', 'hn_disable_feed', 1);
add_action('do_feed_rss2', 'hn_disable_feed', 1);
add_action('do_feed_atom', 'hn_disable_feed', 1);
function hn_disable_feed() {
    wp_die('No feed available', '', ['response' => 403]);
}

// 6. Tắt toàn bộ Comments & Pingbacks
add_action('admin_init', function () {
    global $pagenow;
    if ($pagenow === 'edit-comments.php') {
        wp_safe_redirect(admin_url());
        exit;
    }
    remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
});
add_filter('comments_open', '__return_false', 20, 2);
add_filter('pings_open', '__return_false', 20, 2);

// 7. Tắt trình soạn thảo Gutenberg Block Editor (giữ Classic/Headless nhẹ nhàng)
add_filter('use_block_editor_for_post_type', '__return_false');
add_filter('use_widgets_block_editor', '__return_false');

/**
 * =========================================================================
 * 🔑 BẢO MẬT API (REST API & WPGRAPHQL)
 * =========================================================================
 */
function hn_get_all_headers() {
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if ($headers !== false) {
            return array_change_key_case($headers, CASE_LOWER);
        }
    }
    $headers = [];
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) === 'HTTP_') {
            $key = strtolower(str_replace('_', '-', substr($name, 5)));
            $headers[$key] = $value;
        }
    }
    return $headers;
}

function hn_check_api_permission() {
    if (is_user_logged_in() && (current_user_can('edit_posts') || current_user_can('manage_options'))) {
        return true;
    }

    $expected_secret = defined('HN_API_SECRET') ? HN_API_SECRET : '';
    if (empty($expected_secret)) {
        return false;
    }

    $headers = hn_get_all_headers();
    $incoming_secret = '';

    $auth_header = $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!empty($auth_header) && preg_match('/Bearer\s+(\S+)/i', $auth_header, $matches)) {
        $incoming_secret = trim($matches[1]);
    }

    if (empty($incoming_secret)) {
        $incoming_secret = $headers['x-api-key'] 
            ?? $headers['x-graphql-secret'] 
            ?? $headers['x-secret-key'] 
            ?? '';
    }

    if (empty($incoming_secret) && !empty($_GET['secret'])) {
        $incoming_secret = sanitize_text_field($_GET['secret']);
    }

    if (!empty($incoming_secret) && hash_equals($expected_secret, (string)$incoming_secret)) {
        return true;
    }

    return false;
}

add_filter('rest_authentication_errors', function ($result) {
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        return $result;
    }
    if (!empty($result)) {
        return $result;
    }
    if (hn_check_api_permission()) {
        return true; 
    }
    return new WP_Error(
        'rest_forbidden',
        'Unauthorized access. Valid HomeNest API Secret Key is required.',
        ['status' => 401]
    );
}, 99);

add_action('graphql_execute_http', function ($request) {
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        return;
    }
    if (!hn_check_api_permission()) {
        status_header(401);
        header('Content-Type: application/json; charset=utf-8');
        echo wp_json_encode([
            'errors' => [
                [
                    'message' => 'Unauthorized access. Valid HomeNest API Secret Key is required.',
                    'extensions' => [
                        'code'   => 'UNAUTHORIZED',
                        'status' => 401
                    ]
                ]
            ]
        ]);
        exit;
    }
}, 10);


/**
 * =========================================================================
 * 📋 BẢNG HƯỚNG DẪN & TỰ ĐỘNG KIỂM TRA WP-CONFIG (CHO DEV / TEAM)
 * =========================================================================
 */
add_action('admin_notices', function () {
    $has_secret = defined('HN_API_SECRET') && !empty(HN_API_SECRET) && HN_API_SECRET !== 'xxx';
    if (!$has_secret) {
        ?>
        <div class="notice notice-warning is-dismissible" style="border-left-color: #0284c7; padding: 12px 16px;">
            <p style="font-size: 14px; margin: 0 0 6px; font-weight: 600; color: #0f172a;">
                🛡️ HomeNest Headless CMS: Website này chưa cấu hình Secret Key trong <code>wp-config.php</code>!
            </p>
            <p style="margin: 0; color: #475569;">
                Vui lòng mở file <code>wp-config.php</code> và thêm cấu hình để kích hoạt bảo vệ API. 
                <a href="<?php echo esc_url(admin_url('index.php')); ?>" style="color: #0284c7; font-weight: 600;">Xem hướng dẫn tại Bảng tin &rarr;</a>
            </p>
        </div>
        <?php
    }
});

add_action('wp_dashboard_setup', function () {
    wp_add_dashboard_widget(
        'hn_headless_guide_widget',
        '🚀 HomeNest Headless CMS — Hướng Dẫn Cấu Hình & API Docs',
        'hn_render_dashboard_widget'
    );
});

function hn_render_dashboard_widget() {
    $has_secret = defined('HN_API_SECRET') && !empty(HN_API_SECRET) && HN_API_SECRET !== 'xxx';
    $site_url = home_url();
    ?>
    <style>
        .hn-widget { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 13px; }
        .hn-status-box { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px; }
        .hn-badge-ok { background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
        .hn-badge-warn { background: #fef9c3; color: #854d0e; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
        .hn-code-box { background: #0f172a; color: #38bdf8; padding: 12px; border-radius: 8px; font-family: Consolas, Monaco, monospace; font-size: 12px; overflow-x: auto; line-height: 1.5; margin: 6px 0 14px; }
        .hn-title { font-weight: 600; color: #0f172a; margin-top: 12px; margin-bottom: 4px; font-size: 13.5px; }
        .hn-list { margin: 0; padding-left: 18px; color: #475569; line-height: 1.6; }
    </style>
    <div class="hn-widget">
        <div class="hn-status-box">
            <strong style="color: #0f172a;">Trạng thái Bảo Mật API:</strong>
            <?php if ($has_secret): ?>
                <span class="hn-badge-ok">✅ Đã kích hoạt trong wp-config.php</span>
            <?php else: ?>
                <span class="hn-badge-warn">⚠️ Chưa cấu hình trong wp-config.php</span>
            <?php endif; ?>
        </div>

        <div class="hn-title">1. Đoạn mã bắt buộc trong <code>wp-config.php</code>:</div>
        <pre class="hn-code-box"><code>// HomeNest Headless Configuration
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}
define('FORCE_SSL_ADMIN', true);
define('HN_API_SECRET', 'nhap_ma_bi_mat_rieng_cho_web_nay');</code></pre>

        <div class="hn-title">2. Thông tin kết nối cho Frontend (Next.js / React / App):</div>
        <ul class="hn-list">
            <li><strong>REST API:</strong> <code><?php echo esc_url($site_url); ?>/wp-json/wp/v2/posts</code></li>
            <li><strong>WPGraphQL:</strong> <code><?php echo esc_url($site_url); ?>/graphql</code></li>
        </ul>
    </div>
    <?php
}


/**
 * =========================================================================
 * 👥 1. MENU QUẢN LÝ LEAD (CRM NỘI BỘ TRÊN WORDPRESS)
 * =========================================================================
 */
add_action('init', function () {
    register_post_type('crm_lead', [
        'labels' => [
            'name'          => 'Quản Lý Lead (CRM)',
            'singular_name' => 'Lead',
            'menu_name'     => 'Quản Lý Lead',
            'all_items'     => 'Tất cả khách hàng',
            'search_items'  => 'Tìm kiếm khách hàng',
        ],
        'public'          => false,
        'show_ui'         => true,
        'show_in_menu'    => true,
        'menu_position'   => 4,
        'menu_icon'       => 'dashicons-groups',
        'supports'        => ['title'],
    ]);
});

add_filter('manage_crm_lead_posts_columns', function ($columns) {
    return [
        'cb'           => '<input type="checkbox" />',
        'title'        => 'Họ và Tên',
        'lead_phone'   => 'Số Điện Thoại',
        'lead_email'   => 'Email',
        'lead_course'  => 'Khóa Học / Nhu Cầu',
        'lead_message' => 'Lời Nhắn',
        'lead_status'  => 'Trạng Thái',
        'date'         => 'Thời Gian',
    ];
});

add_action('manage_crm_lead_posts_custom_column', function ($column, $post_id) {
    switch ($column) {
        case 'lead_phone':
            $phone = get_post_meta($post_id, '_lead_phone', true);
            echo $phone ? '<a href="tel:' . esc_attr($phone) . '"><strong>' . esc_html($phone) . '</strong></a>' : '—';
            break;
        case 'lead_email':
            $email = get_post_meta($post_id, '_lead_email', true);
            echo $email ? '<a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a>' : '—';
            break;
        case 'lead_course':
            echo esc_html(get_post_meta($post_id, '_lead_course', true) ?: 'Tư vấn');
            break;
        case 'lead_message':
            echo esc_html(get_post_meta($post_id, '_lead_message', true) ?: '—');
            break;
        case 'lead_status':
            $status = get_post_meta($post_id, '_lead_status', true) ?: 'new';
            $colors = ['new' => '#2271b1', 'contacted' => '#dba617', 'enrolled' => '#00a32a', 'cancelled' => '#d63638'];
            $labels = ['new' => 'Mới', 'contacted' => 'Đã liên hệ', 'enrolled' => 'Đã đăng ký', 'cancelled' => 'Hủy'];
            $c = $colors[$status] ?? '#2271b1';
            $l = $labels[$status] ?? $status;
            echo "<span style='background:{$c}; color:#fff; padding:3px 8px; border-radius:4px; font-size:12px; font-weight:600;'>{$l}</span>";
            break;
    }
}, 10, 2);


/**
 * =========================================================================
 * 🌐 2. TOÀN BỘ REST API HOMENEST (GOM 1 HOOK DUY NHẤT)
 * =========================================================================
 */
add_action('rest_api_init', function () {

    // A. LẤY CHI TIẾT SẢN PHẨM + RANKMATH SEO (GET /wp-json/homenest/v1/product/{slug})
    register_rest_route('homenest/v1', '/product/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'callback' => function ($data) {
            $post = get_page_by_path($data['slug'], OBJECT, 'product');
            if (!$post) return new WP_Error('not_found', 'Sản phẩm không tồn tại', ['status' => 404]);

            $product = function_exists('wc_get_product') ? wc_get_product($post->ID) : null;
            if (!$product) return new WP_Error('wc_missing', 'WooCommerce chưa kích hoạt', ['status' => 500]);

            $seo_title = get_post_meta($post->ID, 'rank_math_title', true) ?: $product->get_name();
            $seo_desc = get_post_meta($post->ID, 'rank_math_description', true) ?: wp_strip_all_tags($post->post_excerpt);

            return rest_ensure_response([
                'id'            => $product->get_id(),
                'title'         => $product->get_name(),
                'slug'          => $post->post_name,
                'price'         => (int)$product->get_price(),
                'regular_price' => (int)$product->get_regular_price(),
                'sale_price'    => (int)$product->get_sale_price(),
                'description'   => $post->post_content,
                'short_description' => $post->post_excerpt,
                'image'         => wp_get_attachment_url($product->get_image_id()),
                'gallery'       => array_map('wp_get_attachment_url', $product->get_gallery_image_ids()),
                'seo'           => ['title' => $seo_title, 'description' => $seo_desc]
            ]);
        },
        'permission_callback' => '__return_true'
    ]);

    // B. CHECKOUT TẠO ĐƠN HÀNG (POST /wp-json/homenest/v1/checkout)
    register_rest_route('homenest/v1', '/checkout', [
        'methods' => 'POST',
        'callback' => function ($request) {
            $params = $request->get_json_params();
            $name    = sanitize_text_field($params['name'] ?? '');
            $phone   = sanitize_text_field($params['phone'] ?? '');
            $email   = sanitize_email($params['email'] ?? '');
            $address = sanitize_text_field($params['address'] ?? '');
            $payment_method = sanitize_text_field($params['payment_method'] ?? 'bacs');
            $items   = $params['items'] ?? [];

            if (empty($name) || empty($phone) || empty($items) || !function_exists('wc_create_order')) {
                return new WP_Error('missing_data', 'Thiếu thông tin đặt hàng hoặc WooCommerce chưa kích hoạt', ['status' => 400]);
            }

            $order = wc_create_order();
            foreach ($items as $item) {
                $order->add_product(wc_get_product($item['product_id']), $item['quantity'] ?? 1);
            }
            $order->set_address(['first_name' => $name, 'email' => $email, 'phone' => $phone, 'address_1' => $address], 'billing');
            $order->set_payment_method($payment_method);
            $order->calculate_totals();
            $order->update_status('pending', 'Đơn hàng tạo từ Next.js Frontend');

            return rest_ensure_response([
                'success'  => true,
                'order_id' => $order->get_id(),
                'total'    => (int)$order->get_total(),
                'message'  => 'Đặt hàng thành công!'
            ]);
        },
        'permission_callback' => '__return_true'
    ]);

    // C. LẤY KHÓA HỌC LEARNPRESS (GET /wp-json/homenest/v1/courses)
    register_rest_route('homenest/v1', '/courses', [
        'methods' => 'GET',
        'callback' => function ($request) {
            $slug = $request->get_param('slug');
            $args = [
                'post_type'      => 'lp_course',
                'posts_per_page' => 20,
                'post_status'    => 'publish',
            ];
            if ($slug) {
                $args['name'] = $slug;
                $args['posts_per_page'] = 1;
            }
            $query = new WP_Query($args);
            $courses = [];

            foreach ($query->posts as $post) {
                $course_id = $post->ID;
                $lp_course = function_exists('learn_press_get_course') ? learn_press_get_course($course_id) : null;
                $curriculum = [];

                if ($lp_course) {
                    $sections = $lp_course->get_curriculum();
                    if ($sections) {
                        foreach ($sections as $section) {
                            $lessons = [];
                            foreach ($section->get_items() as $item) {
                                $lessons[] = $item->get_title();
                            }
                            $curriculum[] = ['title' => $section->get_title(), 'lessons' => $lessons];
                        }
                    }
                }

                $courses[] = [
                    'id'            => (string)$course_id,
                    'title'         => $post->post_title,
                    'slug'          => $post->post_name,
                    'excerpt'       => wp_strip_all_tags($post->post_excerpt),
                    'content'       => apply_filters('the_content', $post->post_content),
                    'featuredImage' => ['node' => ['sourceUrl' => get_the_post_thumbnail_url($course_id, 'full') ?: '']],
                    'courseFields'  => [
                        'duration'      => get_post_meta($course_id, '_lp_duration', true) ?: '10 weeks',
                        'level'         => get_post_meta($course_id, '_lp_level', true) ?: 'All levels',
                        'price'         => get_post_meta($course_id, '_lp_price', true) ?: 0,
                        'originalPrice' => get_post_meta($course_id, '_lp_regular_price', true) ?: 0,
                        'instructor'    => get_the_author_meta('display_name', $post->post_author),
                        'lessons'       => $lp_course ? count($lp_course->get_items()) : 0,
                        'curriculum'    => $curriculum,
                    ],
                    'seo' => [
                        'title'       => get_post_meta($course_id, 'rank_math_title', true) ?: $post->post_title,
                        'description' => get_post_meta($course_id, 'rank_math_description', true) ?: $post->post_excerpt,
                    ]
                ];
            }
            return rest_ensure_response($slug ? ($courses[0] ?? null) : $courses);
        },
        'permission_callback' => '__return_true'
    ]);

    // D. ĐĂNG KÝ HỌC VIÊN (POST /wp-json/homenest/v1/auth/register)
    register_rest_route('homenest/v1', '/auth/register', [
        'methods' => 'POST',
        'callback' => function ($request) {
            $params = $request->get_json_params();
            $fullName = sanitize_text_field($params['fullName'] ?? '');
            $email    = sanitize_email($params['email'] ?? '');
            $phone    = sanitize_text_field($params['phone'] ?? '');
            $username = sanitize_user($params['username'] ?? $email);
            $password = $params['password'] ?? '';

            if (empty($email) || empty($password)) {
                return new WP_Error('missing_data', 'Vui lòng cung cấp Email và Mật khẩu.', ['status' => 400]);
            }

            if (email_exists($email) || username_exists($username)) {
                return new WP_Error('user_exists', 'Email hoặc Tên đăng nhập này đã tồn tại.', ['status' => 409]);
            }

            $user_id = wp_create_user($username, $password, $email);
            if (is_wp_error($user_id)) {
                return new WP_Error('create_failed', $user_id->get_error_message(), ['status' => 500]);
            }

            $user = new WP_User($user_id);
            $user->set_role('student');
            wp_update_user(['ID' => $user_id, 'display_name' => $fullName ?: $username, 'first_name' => $fullName]);
            update_user_meta($user_id, 'phone_number', $phone);

            // Đồng thời lưu vào CRM Lead
            wp_insert_post([
                'post_type'   => 'crm_lead',
                'post_title'  => $fullName ?: $username,
                'post_status' => 'publish',
                'meta_input'  => [
                    '_lead_phone'   => $phone,
                    '_lead_email'   => $email,
                    '_lead_course'  => 'Đăng ký tài khoản học viên mới',
                    '_lead_status'  => 'enrolled',
                ]
            ]);

            return rest_ensure_response([
                'success' => true,
                'user'    => [
                    'id'          => $user_id,
                    'username'    => $username,
                    'email'       => $email,
                    'displayName' => $fullName ?: $username,
                    'role'        => 'student',
                    'avatar'      => get_avatar_url($user_id, ['size' => 96, 'default' => 'identicon']),
                ],
                'message' => 'Tạo tài khoản học viên thành công!'
            ]);
        },
        'permission_callback' => '__return_true'
    ]);

/**
 * Lấy URL avatar đa nguồn cho người dùng WordPress Headless
 * Hỗ trợ Simple Local Avatars, ACF avatar, Ultimate Member và Gravatar
 */
function hn_get_user_avatar_url($user_id) {
    if (empty($user_id)) return '';

    // 1. Kiểm tra Simple Local Avatars
    $local_avatar = get_user_meta($user_id, 'simple_local_avatar', true);
    if (!empty($local_avatar) && is_array($local_avatar) && !empty($local_avatar['full'])) {
        return $local_avatar['full'];
    }

    // 2. Kiểm tra ACF / Custom User Meta Avatar
    $custom_avatar = get_user_meta($user_id, 'user_avatar', true) 
        ?: get_user_meta($user_id, 'avatar', true) 
        ?: get_user_meta($user_id, 'profile_photo', true);

    if (!empty($custom_avatar)) {
        if (is_numeric($custom_avatar)) {
            $img_url = wp_get_attachment_image_url((int)$custom_avatar, 'full');
            if ($img_url) return $img_url;
        } elseif (is_string($custom_avatar) && filter_var($custom_avatar, FILTER_VALIDATE_URL)) {
            return $custom_avatar;
        }
    }

    // 3. Ultimate Member Profile Photo
    $um_photo = get_user_meta($user_id, 'profile_photo', true);
    if (!empty($um_photo)) {
        $upload_dir = wp_upload_dir();
        $um_url = $upload_dir['baseurl'] . '/ultimatemember/' . $user_id . '/' . $um_photo;
        return $um_url;
    }

    // 4. get_avatar_url của WordPress (Gravatar)
    $wp_avatar = get_avatar_url($user_id, ['size' => 150, 'default' => 'identicon']);
    if (!empty($wp_avatar)) {
        return $wp_avatar;
    }

    $user = get_user_by('id', $user_id);
    $name = $user ? $user->display_name : 'User';
    return 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&background=AF8861&color=ffffff&size=150&bold=true';
}

    // E. ĐĂNG NHẬP & PHÂN QUYỀN (POST /wp-json/homenest/v1/auth/login)
    register_rest_route('homenest/v1', '/auth/login', [
        'methods' => 'POST',
        'callback' => function ($request) {
            $params = $request->get_json_params();
            $username = sanitize_text_field($params['username'] ?? '');
            $password = $params['password'] ?? '';

            $user = wp_authenticate($username, $password);
            if (is_wp_error($user)) {
                return new WP_Error('invalid_login', 'Tài khoản hoặc mật khẩu không chính xác.', ['status' => 401]);
            }

            $roles = $user->roles;
            $isTeacher = in_array('teacher', $roles) || in_array('instructor', $roles) || in_array('administrator', $roles);
            $role = $isTeacher ? 'teacher' : 'student';

            return rest_ensure_response([
                'success' => true,
                'user'    => [
                    'id'          => $user->ID,
                    'username'    => $user->user_login,
                    'email'       => $user->user_email,
                    'displayName' => $user->display_name,
                    'role'        => $role,
                    'avatar'      => hn_get_user_avatar_url($user->ID),
                    'redirectUrl' => $isTeacher ? '/teacher' : '/student',
                ],
                'message' => 'Đăng nhập thành công!'
            ]);
        },
        'permission_callback' => '__return_true'
    ]);

    // E.1. LẤY THÔNG TIN TÀI KHOẢN HIỆN TẠI (GET /wp-json/homenest/v1/auth/me)
    register_rest_route('homenest/v1', '/auth/me', [
        'methods' => 'GET',
        'callback' => function ($request) {
            $userId = $request->get_param('userId') ?: $request->get_param('user_id');
            $userEmail = $request->get_param('userEmail') ?: $request->get_param('user_email');
            $username = $request->get_param('username') ?: $request->get_param('login');
            $user = null;

            if (!empty($userId)) {
                $user = get_user_by('id', (int)$userId);
            }
            if (!$user && !empty($userEmail)) {
                $user = get_user_by('email', sanitize_email($userEmail));
            }
            if (!$user && !empty($username)) {
                $user = get_user_by('login', sanitize_user($username));
            }

            if (!$user) {
                return new WP_Error('not_found', 'Không tìm thấy thông tin người dùng.', ['status' => 404]);
            }

            $roles = (array)$user->roles;
            $isTeacher = in_array('teacher', $roles) || in_array('instructor', $roles) || in_array('administrator', $roles);
            $role = $isTeacher ? 'teacher' : 'student';

            return rest_ensure_response([
                'success' => true,
                'user'    => [
                    'id'          => $user->ID,
                    'username'    => $user->user_login,
                    'email'       => $user->user_email,
                    'displayName' => $user->display_name,
                    'role'        => $role,
                    'avatar'      => hn_get_user_avatar_url($user->ID),
                    'phone'       => get_user_meta($user->ID, 'phone_number', true) ?: '',
                ]
            ]);
        },
        'permission_callback' => '__return_true'
    ]);

    // E.2. LẤY KHÓA HỌC HỌC VIÊN ĐÃ ĐĂNG KÝ TRONG LEARNPRESS (GET /wp-json/homenest/v1/user-courses)
    register_rest_route('homenest/v1', '/user-courses', [
        'methods' => 'GET',
        'callback' => function ($request) {
            $userId = $request->get_param('userId') ?: $request->get_param('user_id');
            $userEmail = $request->get_param('userEmail') ?: $request->get_param('user_email');

            if (empty($userId) && !empty($userEmail)) {
                $user_obj = get_user_by('email', $userEmail);
                if ($user_obj) {
                    $userId = $user_obj->ID;
                }
            }

            if (empty($userId)) {
                return rest_ensure_response([]);
            }

            global $wpdb;
            $course_ids = [];
            $progress_map = [];

            // 1. Kiểm tra bảng learnpress_user_items của LearnPress
            $table_user_items = $wpdb->prefix . 'learnpress_user_items';
            $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$table_user_items}'") === $table_user_items;

            if ($table_exists) {
                $items = $wpdb->get_results($wpdb->prepare(
                    "SELECT item_id, status, graduation FROM {$table_user_items} 
                     WHERE user_id = %d 
                       AND item_type = 'lp_course' 
                       AND status IN ('enrolled', 'in-progress', 'completed', 'finished')",
                    (int)$userId
                ));

                if (!empty($items)) {
                    foreach ($items as $item) {
                        $cid = (int)$item->item_id;
                        $course_ids[] = $cid;
                        if ($item->status === 'completed' || $item->status === 'finished' || $item->graduation === 'passed') {
                            $progress_map[$cid] = 100;
                        }
                    }
                }
            }

            // 2. Kiểm tra hàm LP_User nếu LearnPress đang active
            if (function_exists('learn_press_get_user')) {
                $lp_user = learn_press_get_user((int)$userId);
                if ($lp_user && method_exists($lp_user, 'get_enrolled_courses')) {
                    $enrolled = $lp_user->get_enrolled_courses();
                    if (!empty($enrolled) && is_array($enrolled)) {
                        foreach ($enrolled as $enrolled_id => $enrolled_obj) {
                            $cid = (int)$enrolled_id;
                            $course_ids[] = $cid;
                            if (method_exists($lp_user, 'get_course_data')) {
                                $cdata = $lp_user->get_course_data($cid);
                                if ($cdata && method_exists($cdata, 'get_percent_result')) {
                                    $progress_map[$cid] = (float)$cdata->get_percent_result();
                                }
                            }
                        }
                    }
                }
            }

            // 3. Kiểm tra các đơn hàng lp_order của user
            $orders = get_posts([
                'post_type'   => 'lp_order',
                'post_status' => ['lp-completed', 'publish', 'completed'],
                'meta_key'    => '_user_id',
                'meta_value'  => (int)$userId,
                'numberposts' => 50,
            ]);
            if (!empty($orders)) {
                foreach ($orders as $order) {
                    $order_items = get_post_meta($order->ID, '_order_items', true);
                    if (!empty($order_items) && is_array($order_items)) {
                        foreach ($order_items as $oitem) {
                            if (!empty($oitem['course_id'])) {
                                $course_ids[] = (int)$oitem['course_id'];
                            }
                        }
                    }
                }
            }

            // 4. Kiểm tra user meta _enrolled_courses
            $meta_enrolled = get_user_meta((int)$userId, '_enrolled_courses', true) ?: get_user_meta((int)$userId, 'enrolled_courses', true);
            if (!empty($meta_enrolled) && is_array($meta_enrolled)) {
                foreach ($meta_enrolled as $mc) {
                    if (is_numeric($mc)) $course_ids[] = (int)$mc;
                }
            }

            $course_ids = array_values(array_unique(array_filter($course_ids)));

            if (empty($course_ids)) {
                return rest_ensure_response([]);
            }

            // Truy vấn chi tiết các khóa học đã đăng ký
            $query = new WP_Query([
                'post_type'      => 'lp_course',
                'post__in'       => $course_ids,
                'posts_per_page' => count($course_ids),
                'post_status'    => 'publish',
            ]);

            $courses = [];
            foreach ($query->posts as $post) {
                $course_id = $post->ID;
                $lp_course = function_exists('learn_press_get_course') ? learn_press_get_course($course_id) : null;
                $curriculum = [];

                if ($lp_course) {
                    $sections = $lp_course->get_curriculum();
                    if ($sections) {
                        foreach ($sections as $section) {
                            $lessons = [];
                            foreach ($section->get_items() as $item) {
                                $lessons[] = $item->get_title();
                            }
                            $curriculum[] = ['title' => $section->get_title(), 'lessons' => $lessons];
                        }
                    }
                }

                $terms = wp_get_post_terms($course_id, ['course_category', 'lp_course_category']);
                $categories = [];
                foreach ($terms as $t) {
                    $categories[] = [
                        'id'       => $t->term_id,
                        'name'     => $t->name,
                        'slug'     => $t->slug,
                        'taxonomy' => $t->taxonomy,
                    ];
                }

                $thumb_url = get_the_post_thumbnail_url($course_id, 'full') ?: '';
                $author_name = get_the_author_meta('display_name', $post->post_author) ?: 'Admin';
                $author_avatar = get_avatar_url($post->post_author, ['size' => 96]) ?: '';

                $courses[] = [
                    'id'            => (string)$course_id,
                    'databaseId'    => $course_id,
                    'title'         => $post->post_title,
                    'slug'          => $post->post_name,
                    'excerpt'       => wp_strip_all_tags($post->post_excerpt),
                    'content'       => apply_filters('the_content', $post->post_content),
                    'image'         => $thumb_url,
                    'featured_image_url' => $thumb_url,
                    'featuredImage' => ['node' => ['sourceUrl' => $thumb_url]],
                    'categories'    => $categories,
                    'progress'      => $progress_map[$course_id] ?? 0,
                    'trainer'       => [
                        'name'   => $author_name,
                        'avatar' => $author_avatar,
                        'rating' => '5.0',
                    ],
                    'courseFields'  => [
                        'duration'      => get_post_meta($course_id, '_lp_duration', true) ?: '10 weeks',
                        'level'         => get_post_meta($course_id, '_lp_level', true) ?: 'All levels',
                        'price'         => get_post_meta($course_id, '_lp_price', true) ?: 0,
                        'originalPrice' => get_post_meta($course_id, '_lp_regular_price', true) ?: 0,
                        'instructor'    => $author_name,
                        'lessons'       => $lp_course ? count($lp_course->get_items()) : 0,
                        'curriculum'    => $curriculum,
                        'categories'    => $categories,
                        'progress'      => $progress_map[$course_id] ?? 0,
                        'trainer'       => [
                            'name'   => $author_name,
                            'avatar' => $author_avatar,
                            'rating' => '5.0',
                        ],
                    ],
                ];
            }

            return rest_ensure_response($courses);
        },
        'permission_callback' => '__return_true'
    ]);

    // E.3. ENROLL KHÓA HỌC CHO HỌC VIÊN TRONG LEARNPRESS (POST /wp-json/homenest/v1/courses/enroll)
    // Lưu chính thức vào database LearnPress để hiển thị trên page=learn-press-students-enrolled
    register_rest_route('homenest/v1', '/courses/enroll', [
        'methods' => 'POST',
        'callback' => function ($request) {
            $params = $request->get_json_params();
            $courseId = $params['courseId'] ?? $params['course_id'] ?? $params['id'] ?? 0;
            $courseSlug = sanitize_text_field($params['courseSlug'] ?? $params['course_slug'] ?? '');
            $userId = $params['userId'] ?? $params['user_id'] ?? 0;
            $userEmail = sanitize_email($params['userEmail'] ?? $params['user_email'] ?? '');
            $username = sanitize_user($params['username'] ?? $params['login'] ?? '');

            // 1. Xác định Course ID
            if (empty($courseId) && !empty($courseSlug)) {
                $post = get_page_by_path($courseSlug, OBJECT, 'lp_course');
                if (!$post) {
                    $q = new WP_Query([
                        'post_type'      => 'lp_course',
                        'name'           => $courseSlug,
                        'posts_per_page' => 1,
                        'post_status'    => 'publish',
                    ]);
                    $post = $q->posts[0] ?? null;
                }
                if ($post) {
                    $courseId = $post->ID;
                }
            }

            if (empty($courseId)) {
                return new WP_Error('missing_course', 'Không tìm thấy thông tin khóa học.', ['status' => 400]);
            }

            // 2. Xác định User ID
            if (empty($userId) && !empty($userEmail)) {
                $user_obj = get_user_by('email', $userEmail);
                if ($user_obj) {
                    $userId = $user_obj->ID;
                }
            }

            if (empty($userId) && !empty($username)) {
                $user_obj = get_user_by('login', $username);
                if ($user_obj) {
                    $userId = $user_obj->ID;
                }
            }

            if (empty($userId)) {
                return new WP_Error('missing_user', 'Vui lòng đăng nhập để tham gia khóa học.', ['status' => 401]);
            }

            global $wpdb;
            $courseId = (int)$courseId;
            $userId   = (int)$userId;
            $courseTitle = get_the_title($courseId) ?: "Course #{$courseId}";

            // 3. Tạo Đơn Hàng LearnPress (lp_order) với trạng thái lp-completed
            $order_id = wp_insert_post([
                'post_type'   => 'lp_order',
                'post_title'  => sprintf('Order #%s - %s', date('YmdHis'), $courseTitle),
                'post_status' => 'lp-completed',
                'post_author' => $userId,
                'post_date'   => current_time('mysql'),
            ]);

            if ($order_id && !is_wp_error($order_id)) {
                update_post_meta($order_id, '_user_id', $userId);
                update_post_meta($order_id, '_order_currency', 'VND');
                update_post_meta($order_id, '_order_subtotal', 0);
                update_post_meta($order_id, '_order_total', 0);
                update_post_meta($order_id, '_payment_method', 'free_enroll');
                update_post_meta($order_id, '_payment_method_title', 'Headless Free Enrollment');
                update_post_meta($order_id, '_order_version', '4.0.0');

                // Lưu vào bảng learnpress_order_items & learnpress_order_itemmeta
                $table_order_items = $wpdb->prefix . 'learnpress_order_items';
                $table_order_itemmeta = $wpdb->prefix . 'learnpress_order_itemmeta';

                if ($wpdb->get_var("SHOW TABLES LIKE '{$table_order_items}'") === $table_order_items) {
                    $wpdb->insert($table_order_items, [
                        'order_id'  => $order_id,
                        'item_id'   => $courseId,
                        'item_name' => $courseTitle,
                    ]);
                    $order_item_id = $wpdb->insert_id;

                    if ($order_item_id && $wpdb->get_var("SHOW TABLES LIKE '{$table_order_itemmeta}'") === $table_order_itemmeta) {
                        $wpdb->insert($table_order_itemmeta, [
                            'learnpress_order_item_id' => $order_item_id,
                            'meta_key'                 => '_course_id',
                            'meta_value'               => $courseId,
                        ]);
                        $wpdb->insert($table_order_itemmeta, [
                            'learnpress_order_item_id' => $order_item_id,
                            'meta_key'                 => '_quantity',
                            'meta_value'               => 1,
                        ]);
                        $wpdb->insert($table_order_itemmeta, [
                            'learnpress_order_item_id' => $order_item_id,
                            'meta_key'                 => '_subtotal',
                            'meta_value'               => 0,
                        ]);
                        $wpdb->insert($table_order_itemmeta, [
                            'learnpress_order_item_id' => $order_item_id,
                            'meta_key'                 => '_total',
                            'meta_value'               => 0,
                        ]);
                    }
                }
            }

            // 4. Lưu học viên vào bảng learnpress_user_items (Nguồn hiển thị page=learn-press-students-enrolled)
            $table_user_items = $wpdb->prefix . 'learnpress_user_items';
            $user_item_id = 0;

            if ($wpdb->get_var("SHOW TABLES LIKE '{$table_user_items}'") === $table_user_items) {
                $existing = $wpdb->get_row($wpdb->prepare(
                    "SELECT user_item_id, status FROM {$table_user_items} 
                     WHERE user_id = %d AND item_id = %d AND item_type = 'lp_course'",
                    $userId,
                    $courseId
                ));

                if ($existing) {
                    $wpdb->update(
                        $table_user_items,
                        [
                            'status'     => 'enrolled',
                            'graduation' => 'in-progress',
                            'ref_id'     => $order_id ?: 0,
                            'ref_type'   => 'lp_order',
                            'start_time' => current_time('mysql'),
                        ],
                        ['user_item_id' => $existing->user_item_id]
                    );
                    $user_item_id = $existing->user_item_id;
                } else {
                    $wpdb->insert($table_user_items, [
                        'user_id'      => $userId,
                        'item_id'      => $courseId,
                        'start_time'   => current_time('mysql'),
                        'item_type'    => 'lp_course',
                        'status'       => 'enrolled',
                        'graduation'   => 'in-progress',
                        'access_level' => 50,
                        'ref_id'       => $order_id ?: 0,
                        'ref_type'     => 'lp_order',
                        'parent_id'    => 0,
                    ]);
                    $user_item_id = $wpdb->insert_id;
                }
            }

            // 5. Kích hoạt phương thức LP_User nếu LearnPress Core đang active
            if (function_exists('learn_press_get_user')) {
                $lp_user = learn_press_get_user($userId);
                if ($lp_user && method_exists($lp_user, 'enroll')) {
                    try {
                        $lp_user->enroll($courseId);
                    } catch (\Throwable $e) {
                        // Đã lưu trực tiếp DB an toàn
                    }
                }
            }

            // 6. Kích hoạt các Action Hooks của LearnPress để cập nhật các Addon và trang quản trị
            if ($user_item_id) {
                do_action('learnpress/user/enrolled-course', $user_item_id, $courseId, $userId);
                do_action('learn_press_user_enrolled_course', $courseId, $userId, $user_item_id);
            }
            if ($order_id && !is_wp_error($order_id)) {
                do_action('learn_press_order_status_completed', $order_id);
                do_action('learnpress/order/status-completed', $order_id);
            }

            // 7. Cập nhật User Meta _enrolled_courses
            $enrolled_meta = get_user_meta($userId, '_enrolled_courses', true) ?: [];
            if (!is_array($enrolled_meta)) $enrolled_meta = [];
            if (!in_array($courseId, $enrolled_meta)) {
                $enrolled_meta[] = $courseId;
                update_user_meta($userId, '_enrolled_courses', $enrolled_meta);
            }

            // 8. Cập nhật số lượng học viên khóa học (count_enrolled_users)
            $current_students = (int)get_post_meta($courseId, 'count_enrolled_users', true);
            update_post_meta($courseId, 'count_enrolled_users', max(1, $current_students + 1));

            return rest_ensure_response([
                'success'      => true,
                'status'       => 'success',
                'message'      => 'Đăng ký khóa học thành công!',
                'course_id'    => $courseId,
                'user_id'      => $userId,
                'order_id'     => $order_id ?: 0,
                'user_item_id' => $user_item_id ?: 0,
            ]);
        },
        'permission_callback' => '__return_true'
    ]);

    // F. TIẾP NHẬN FORM LIÊN HỆ / TƯ VẤN (POST /wp-json/homenest/v1/lead)
    register_rest_route('homenest/v1', '/lead', [
        'methods' => 'POST',
        'callback' => function ($request) {
            $params = $request->get_json_params();
            $name    = sanitize_text_field($params['name'] ?? '');
            $phone   = sanitize_text_field($params['phone'] ?? '');
            $email   = sanitize_email($params['email'] ?? '');
            $course  = sanitize_text_field($params['course'] ?? '');
            $message = sanitize_textarea_field($params['message'] ?? '');

            if (empty($name) && empty($phone) && empty($email)) {
                return new WP_Error('missing_fields', 'Vui lòng cung cấp thông tin liên hệ.', ['status' => 400]);
            }

            $post_id = wp_insert_post([
                'post_type'   => 'crm_lead',
                'post_title'  => $name ?: "Khách hàng {$phone}",
                'post_status' => 'publish',
            ]);

            if (is_wp_error($post_id)) {
                return new WP_Error('db_error', 'Không thể lưu Lead', ['status' => 500]);
            }

            update_post_meta($post_id, '_lead_phone', $phone);
            update_post_meta($post_id, '_lead_email', $email);
            update_post_meta($post_id, '_lead_course', $course);
            update_post_meta($post_id, '_lead_message', $message);
            update_post_meta($post_id, '_lead_status', 'new');

            // Gửi email thông báo cho Admin
            $admin_email = get_option('admin_email');
            $subject = "[CRM Khóa Học] Lead mới: {$name} - {$phone}";
            $body = "Họ tên: {$name}\nSố điện thoại: {$phone}\nEmail: {$email}\nKhóa học quan tâm: {$course}\nLời nhắn: {$message}";
            wp_mail($admin_email, $subject, $body);

            return rest_ensure_response([
                'success' => true,
                'lead_id' => $post_id,
                'message' => 'Đã tiếp nhận thông tin và lưu vào CRM thành công!'
            ]);
        },
        'permission_callback' => '__return_true'
    ]);

    // G. TÍCH HỢP RANK MATH SEO CHO TOÀN BỘ REST API POST TYPES
    $supported_types = ['post', 'page', 'lp_course', 'lp_lesson', 'product', 'courses', 'course', 'lesson'];
    foreach ($supported_types as $post_type) {
        register_rest_field($post_type, 'rank_math_seo', [
            'get_callback' => function ($object) {
                $post_id = $object['id'] ?? 0;
                if (!$post_id) return null;

                $title = get_post_meta($post_id, 'rank_math_title', true);
                if (empty($title)) {
                    $title = get_the_title($post_id);
                }

                $description = get_post_meta($post_id, 'rank_math_description', true);
                if (empty($description)) {
                    $description = wp_strip_all_tags(get_the_excerpt($post_id));
                }

                $focus_keyword = get_post_meta($post_id, 'rank_math_focus_keyword', true);
                $canonical = get_post_meta($post_id, 'rank_math_canonical_url', true);
                if (empty($canonical)) {
                    $canonical = get_permalink($post_id);
                }

                $og_title = get_post_meta($post_id, 'rank_math_facebook_title', true) ?: $title;
                $og_desc  = get_post_meta($post_id, 'rank_math_facebook_description', true) ?: $description;
                $og_image_url = get_post_meta($post_id, 'rank_math_facebook_image', true);
                if (empty($og_image_url)) {
                    $og_image_url = get_the_post_thumbnail_url($post_id, 'full') ?: '';
                }

                $twitter_title = get_post_meta($post_id, 'rank_math_twitter_title', true) ?: $og_title;
                $twitter_desc  = get_post_meta($post_id, 'rank_math_twitter_description', true) ?: $og_desc;
                $twitter_image_url = get_post_meta($post_id, 'rank_math_twitter_image', true);
                if (empty($twitter_image_url)) {
                    $twitter_image_url = $og_image_url;
                }

                $robots = get_post_meta($post_id, 'rank_math_robots', true);
                $robots_array = is_array($robots) ? $robots : (is_string($robots) ? explode(',', $robots) : []);
                $is_noindex = in_array('noindex', $robots_array);
                $is_nofollow = in_array('nofollow', $robots_array);

                // Trích xuất Schema từ Rank Math nếu có
                $rich_snippet = get_post_meta($post_id, 'rank_math_rich_snippet', true);
                $schema_data = null;
                if (!empty($rich_snippet)) {
                    $schema_data = get_post_meta($post_id, "rank_math_snippet_{$rich_snippet}", true);
                    if (empty($schema_data)) {
                        $custom_schema = get_post_meta($post_id, 'rank_math_schema_' . ucfirst($rich_snippet), true);
                        if (!empty($custom_schema)) {
                            $schema_data = $custom_schema;
                        }
                    }
                }

                return [
                    'title'                => $title,
                    'metaDesc'             => $description,
                    'focusKeyword'         => $focus_keyword,
                    'canonical'            => $canonical,
                    'opengraphTitle'       => $og_title,
                    'opengraphDescription' => $og_desc,
                    'opengraphImage'       => [
                        'sourceUrl' => $og_image_url,
                    ],
                    'twitterTitle'         => $twitter_title,
                    'twitterDescription'   => $twitter_desc,
                    'twitterImage'         => [
                        'sourceUrl' => $twitter_image_url,
                    ],
                    'metaRobotsNoindex'    => $is_noindex ? 'noindex' : 'index',
                    'metaRobotsNofollow'   => $is_nofollow ? 'nofollow' : 'follow',
                    'schema'               => $schema_data,
                    'schemaType'           => $rich_snippet ?: null,
                ];
            },
            'schema' => null,
        ]);
    }

    // H. EXPOSE TRƯỜNG ACF 'lesson_videos', 'attached_quiz', 'acf' CHO LP_LESSON (WP REST API)
    $lesson_post_types = ['lp_lesson', 'lesson', 'lp_course'];
    foreach ($lesson_post_types as $l_type) {
        // 1. Expose toàn bộ object acf
        register_rest_field($l_type, 'acf', [
            'get_callback' => function ($object) {
                $post_id = $object['id'] ?? 0;
                if (!$post_id || !function_exists('get_fields')) return null;
                $fields = get_fields($post_id);
                return is_array($fields) ? $fields : null;
            },
            'schema' => null,
        ]);

        // 2. Expose trực tiếp trường lesson_videos
        register_rest_field($l_type, 'lesson_videos', [
            'get_callback' => function ($object) {
                $post_id = $object['id'] ?? 0;
                if (!$post_id) return '';
                if (function_exists('get_field')) {
                    $val = get_field('lesson_videos', $post_id);
                    if (!empty($val)) return $val;
                }
                $meta_val = get_post_meta($post_id, 'lesson_videos', true);
                if (!empty($meta_val)) return $meta_val;

                $lp_intro = get_post_meta($post_id, '_lp_lesson_video_intro', true);
                if (!empty($lp_intro)) return $lp_intro;

                return '';
            },
            'schema' => [
                'description' => 'Lesson video embed code or URL from ACF/LearnPress',
                'type'        => 'string',
                'context'     => ['view', 'edit'],
            ],
        ]);

        // 3. Expose trực tiếp trường attached_quiz
        register_rest_field($l_type, 'attached_quiz', [
            'get_callback' => function ($object) {
                $post_id = $object['id'] ?? 0;
                if (!$post_id) return null;
                if (function_exists('get_field')) {
                    $val = get_field('attached_quiz', $post_id);
                    if (!empty($val)) return $val;
                }
                return get_post_meta($post_id, 'attached_quiz', true) ?: null;
            },
            'schema' => null,
        ]);
    }

    // I. CHI TIẾT BÀI HỌC LEARNPRESS (GET /wp-json/homenest/v1/lesson/{slug})
    register_rest_route('homenest/v1', '/lesson/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'callback' => function ($data) {
            $slug = $data['slug'];
            $post = get_page_by_path($slug, OBJECT, 'lp_lesson');
            if (!$post && is_numeric($slug)) {
                $post = get_post((int)$slug);
            }
            if (!$post) {
                $query = new WP_Query([
                    'post_type'      => ['lp_lesson', 'lesson'],
                    'name'           => $slug,
                    'posts_per_page' => 1,
                    'post_status'    => 'publish',
                ]);
                $post = $query->posts[0] ?? null;
            }
            if (!$post) {
                return new WP_Error('not_found', 'Bài học không tồn tại', ['status' => 404]);
            }

            $post_id = $post->ID;
            $video = '';
            if (function_exists('get_field')) {
                $video = get_field('lesson_videos', $post_id);
            }
            if (empty($video)) {
                $video = get_post_meta($post_id, 'lesson_videos', true);
            }
            if (empty($video)) {
                $video = get_post_meta($post_id, '_lp_lesson_video_intro', true);
            }

            $quiz = function_exists('get_field') ? get_field('attached_quiz', $post_id) : get_post_meta($post_id, 'attached_quiz', true);
            $acf_data = function_exists('get_fields') ? get_fields($post_id) : [];

            return rest_ensure_response([
                'id'            => (string)$post_id,
                'title'         => $post->post_title,
                'slug'          => $post->post_name,
                'content'       => apply_filters('the_content', $post->post_content),
                'excerpt'       => wp_strip_all_tags($post->post_excerpt),
                'duration'      => get_post_meta($post_id, '_lp_duration', true) ?: '45 min',
                'lesson_videos' => $video ?: '',
                'video_url'     => $video ?: '',
                'attached_quiz' => $quiz ?: null,
                'acf'           => is_array($acf_data) ? $acf_data : ['lesson_videos' => $video],
                'featuredImage' => ['node' => ['sourceUrl' => get_the_post_thumbnail_url($post_id, 'full') ?: '']],
                'seo'           => [
                    'title'       => get_post_meta($post_id, 'rank_math_title', true) ?: $post->post_title,
                    'description' => get_post_meta($post_id, 'rank_math_description', true) ?: $post->post_excerpt,
                ]
            ]);
        },
        'permission_callback' => '__return_true'
    ]);
});

// 3. ĐẢM BẢO LEARNPRESS POST TYPES LUÔN ĐƯỢC MỞ TRONG REST API
add_filter('register_post_type_args', function ($args, $post_type) {
    if (in_array($post_type, ['lp_course', 'lp_lesson', 'lp_quiz', 'lp_question'])) {
        $args['show_in_rest'] = true;
    }
    return $args;
}, 10, 2);







    