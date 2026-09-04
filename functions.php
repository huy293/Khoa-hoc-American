<?php
/**
 * HOMENEST HEADLESS CMS - FUNCTIONS.PHP
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
// Tắt trình soạn thảo Gutenberg (Block Editor)
add_filter('use_block_editor_for_post_type', '__return_false');

// Tắt trình quản lý widget dựa trên block
add_filter('use_widgets_block_editor', '__return_false');
/**
 * 🔑 BẢO MẬT API (REST API & WPGRAPHQL)
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

// 1. Cảnh báo nổi bật trên đầu trang Admin nếu chưa cấu hình wp-config.php
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

// 2. Tạo Widget tài liệu & trạng thái ngay màn hình chính Dashboard (Tuyệt đối không in Key)
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

            return rest_ensure_response([
                'success' => true,
                'user'    => [
                    'id'          => $user_id,
                    'username'    => $username,
                    'email'       => $email,
                    'displayName' => $fullName ?: $username,
                    'role'        => 'student',
                ],
                'message' => 'Tạo tài khoản học viên thành công!'
            ]);
        },
        'permission_callback' => '__return_true'
    ]);

    // E. ĐĂNG NHẬP & PHÂN QUYỀN (POST /wp-json/homenest/v1/auth/login) - CHỈ 1 LẦN DUY NHẤT
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
                    'redirectUrl' => $isTeacher ? '/teacher' : '/student',
                ],
                'message' => 'Đăng nhập thành công!'
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
    $supported_types = ['post', 'page', 'lp_course', 'product', 'courses', 'course'];
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
                ];
            },
            'schema' => null,
        ]);
    }
});


