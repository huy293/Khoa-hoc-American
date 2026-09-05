<?php
/**
 * Plugin Name: LP Embed Quiz in Lesson
 * Description: Nhúng lp_quiz vào lp_lesson + tự động complete lesson khi pass quiz. Hỗ trợ Headless REST API.
 * Version:     1.0.4
 * Author:      Custom
 * Text Domain: lp-embed-quiz-in-lesson
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( defined( 'LP_EQIL_LOADED' ) ) {
	return;
}
define( 'LP_EQIL_LOADED', true );
define( 'LP_EQIL_VERSION', '1.0.4' );
define( 'LP_EQIL_FILE', __FILE__ );

add_action( 'plugins_loaded', 'lp_eqil_bootstrap', 30 );
add_action( 'init', 'lp_eqil_bootstrap', 5 );
add_action( 'admin_init', 'lp_eqil_bootstrap', 1 );

function lp_eqil_bootstrap() {
	static $booted = false;
	if ( $booted ) {
		return;
	}
	$booted = true;
	LP_EQIL_Plugin::instance();
}

final class LP_EQIL_Plugin {

	private static $instance = null;

	const META_QUIZ_ID      = '_lp_eqil_embedded_quiz_id';
	const META_REQUIRE_PASS = '_lp_eqil_require_pass_quiz';
	const NONCE_ACTION      = 'lp_eqil_save_metabox';
	const NONCE_NAME        = 'lp_eqil_nonce';
	const REST_NS           = 'lp-eqil/v1';

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		// Chỉ đăng ký 1 meta box (normal) — tránh hiện 2 lần
		add_action( 'add_meta_boxes', array( $this, 'add_metabox' ), 20 );
		add_action( 'add_meta_boxes_lp_lesson', array( $this, 'add_metabox' ), 20 );

		add_action( 'save_post_lp_lesson', array( $this, 'save_metabox' ), 10, 2 );
		add_action( 'save_post', array( $this, 'save_metabox_fallback' ), 20, 2 );

		add_action( 'learn-press/after-content-item-summary/lp_lesson', array( $this, 'render_quiz_iframe' ), 25 );

		add_action( 'learn-press/user/quiz-finished', array( $this, 'auto_complete_lesson' ), 30, 3 );
		add_action( 'learn_press_user_finish_quiz', array( $this, 'auto_complete_lesson' ), 30, 3 );

		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
	}

	private function __clone() {}
	public function __wakeup() {
		throw new \Exception( 'Cannot unserialize' );
	}

	public function add_metabox() {
		// Chỉ 1 box, vị trí normal (dưới content) — dễ thấy, không trùng
		add_meta_box(
			'lp_eqil_embedded_quiz',
			__( 'Gắn Quiz vào Lesson (lp_quiz)', 'lp-embed-quiz-in-lesson' ),
			array( $this, 'render_metabox' ),
			'lp_lesson',
			'normal',
			'high'
		);
	}

	public function render_metabox( $post ) {
		if ( ! $post instanceof WP_Post ) {
			return;
		}

		$selected_quiz = absint( get_post_meta( $post->ID, self::META_QUIZ_ID, true ) );
		$require_pass  = get_post_meta( $post->ID, self::META_REQUIRE_PASS, true );

		$quizzes = get_posts( array(
			'post_type'              => 'lp_quiz',
			'posts_per_page'         => 300,
			'post_status'            => array( 'publish', 'private', 'draft' ),
			'orderby'                => 'title',
			'order'                  => 'ASC',
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
			'suppress_filters'       => true,
		) );

		wp_nonce_field( self::NONCE_ACTION, self::NONCE_NAME );
		?>
		<p>
			<label for="lp_eqil_embedded_quiz_id"><strong><?php esc_html_e( 'Chọn Quiz:', 'lp-embed-quiz-in-lesson' ); ?></strong></label><br>
			<select name="lp_eqil_embedded_quiz_id" id="lp_eqil_embedded_quiz_id" style="width:100%;max-width:480px;">
				<option value="0"><?php esc_html_e( '— Không gắn quiz —', 'lp-embed-quiz-in-lesson' ); ?></option>
				<?php foreach ( $quizzes as $quiz ) : ?>
					<option value="<?php echo esc_attr( (string) $quiz->ID ); ?>" <?php selected( $selected_quiz, (int) $quiz->ID ); ?>>
						<?php
						$status = ( 'publish' !== $quiz->post_status ) ? ' [' . $quiz->post_status . ']' : '';
						echo esc_html( $quiz->post_title . $status . ' (#' . $quiz->ID . ')' );
						?>
					</option>
				<?php endforeach; ?>
			</select>
		</p>
		<?php if ( empty( $quizzes ) ) : ?>
			<p style="color:#b32d2e;"><em><?php esc_html_e( 'Chưa có quiz nào. Hãy tạo quiz trong LearnPress → Quizzes trước.', 'lp-embed-quiz-in-lesson' ); ?></em></p>
		<?php endif; ?>
		<p>
			<label>
				<input type="checkbox" name="lp_eqil_require_pass_quiz" value="1" <?php checked( $require_pass, '1' ); ?>>
				<?php esc_html_e( 'Bắt buộc pass quiz mới được Complete Lesson', 'lp-embed-quiz-in-lesson' ); ?>
			</label>
		</p>
		<p class="description"><?php esc_html_e( 'Quiz sẽ hiện bên dưới nội dung lesson (iframe). Khi học viên pass quiz, lesson có thể tự complete.', 'lp-embed-quiz-in-lesson' ); ?></p>
		<?php
	}

	public function save_metabox( $post_id, $post = null ) {
		$this->do_save( $post_id );
	}

	public function save_metabox_fallback( $post_id, $post ) {
		if ( ! $post instanceof WP_Post || 'lp_lesson' !== $post->post_type ) {
			return;
		}
		$this->do_save( $post_id );
	}

	private function do_save( $post_id ) {
		if ( ! isset( $_POST[ self::NONCE_NAME ] ) ) {
			return;
		}
		$nonce = sanitize_text_field( wp_unslash( $_POST[ self::NONCE_NAME ] ) );
		if ( ! wp_verify_nonce( $nonce, self::NONCE_ACTION ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		if ( get_post_type( $post_id ) !== 'lp_lesson' ) {
			return;
		}

		$quiz_id = isset( $_POST['lp_eqil_embedded_quiz_id'] ) ? absint( $_POST['lp_eqil_embedded_quiz_id'] ) : 0;
		if ( $quiz_id > 0 ) {
			$quiz_post = get_post( $quiz_id );
			if ( ! $quiz_post || 'lp_quiz' !== $quiz_post->post_type ) {
				$quiz_id = 0;
			}
		}
		update_post_meta( $post_id, self::META_QUIZ_ID, $quiz_id );

		$require = ( isset( $_POST['lp_eqil_require_pass_quiz'] ) && '1' === $_POST['lp_eqil_require_pass_quiz'] ) ? '1' : '0';
		update_post_meta( $post_id, self::META_REQUIRE_PASS, $require );
	}

	public function render_quiz_iframe() {
		$lesson_id = get_the_ID();
		if ( ! $lesson_id ) {
			return;
		}

		$quiz_id = absint( get_post_meta( $lesson_id, self::META_QUIZ_ID, true ) );
		if ( $quiz_id <= 0 || get_post_type( $quiz_id ) !== 'lp_quiz' ) {
			return;
		}

		$quiz_url = get_permalink( $quiz_id );
		if ( ! $quiz_url && function_exists( 'learn_press_get_quiz' ) ) {
			$quiz = learn_press_get_quiz( $quiz_id );
			if ( $quiz && method_exists( $quiz, 'get_permalink' ) ) {
				$quiz_url = $quiz->get_permalink();
			}
		}
		if ( empty( $quiz_url ) ) {
			return;
		}

		$title = get_the_title( $quiz_id );
		?>
		<div class="lp-eqil-quiz-wrapper" style="margin-top:50px;border-top:3px solid #e5e5e5;padding-top:30px;">
			<h3 style="margin-bottom:20px;"><?php echo esc_html( sprintf( __( 'Bài kiểm tra: %s', 'lp-embed-quiz-in-lesson' ), $title ) ); ?></h3>
			<div style="position:relative;width:100%;min-height:700px;">
				<iframe
					src="<?php echo esc_url( $quiz_url ); ?>"
					style="width:100%;height:800px;border:1px solid #ddd;border-radius:8px;"
					loading="lazy"
					referrerpolicy="strict-origin-when-cross-origin"
					sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
					title="<?php echo esc_attr( $title ); ?>"
					allowfullscreen>
				</iframe>
			</div>
		</div>
		<?php
	}

	public function auto_complete_lesson( $quiz_id, $course_id, $user_id ) {
		$quiz_id   = absint( $quiz_id );
		$course_id = absint( $course_id );
		$user_id   = absint( $user_id );
		if ( ! $quiz_id || ! $user_id || ! function_exists( 'learn_press_get_user' ) ) {
			return;
		}

		$user = learn_press_get_user( $user_id );
		if ( ! $user ) {
			return;
		}

		$current_id = get_current_user_id();
		if ( $current_id && (int) $current_id !== (int) $user_id && ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( ! method_exists( $user, 'get_quiz_results' ) ) {
			return;
		}

		$result    = $user->get_quiz_results( $quiz_id, $course_id );
		$is_passed = false;
		if ( is_array( $result ) ) {
			$is_passed = ( isset( $result['grade'] ) && 'passed' === $result['grade'] )
				|| ( isset( $result['pass'] ) && 1 === (int) $result['pass'] )
				|| ( isset( $result['graduation'] ) && 'passed' === $result['graduation'] );
		}
		if ( ! $is_passed ) {
			return;
		}

		$lessons = get_posts( array(
			'post_type'              => 'lp_lesson',
			'posts_per_page'         => 50,
			'post_status'            => 'publish',
			'fields'                 => 'ids',
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
			'suppress_filters'       => true,
			'meta_query'             => array(
				'relation' => 'AND',
				array(
					'key'     => self::META_QUIZ_ID,
					'value'   => $quiz_id,
					'compare' => '=',
					'type'    => 'NUMERIC',
				),
				array(
					'key'     => self::META_REQUIRE_PASS,
					'value'   => '1',
					'compare' => '=',
				),
			),
		) );

		foreach ( $lessons as $lesson_id ) {
			$lesson_id = absint( $lesson_id );
			if ( method_exists( $user, 'has_completed_lesson' ) && $user->has_completed_lesson( $lesson_id, $course_id ) ) {
				continue;
			}
			try {
				if ( method_exists( $user, 'complete_lesson' ) ) {
					$user->complete_lesson( $lesson_id, $course_id ? $course_id : 0 );
				} elseif ( method_exists( $user, 'finish_lesson' ) ) {
					$user->finish_lesson( $lesson_id, $course_id ? $course_id : 0 );
				}
			} catch ( Exception $e ) {
				// silent
			}
		}
	}

	public function register_rest_routes() {
		register_rest_route( self::REST_NS, '/lesson/(?P<id>\d+)', array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => array( $this, 'rest_get_lesson' ),
			'permission_callback' => array( $this, 'rest_permission' ),
			'args'                => array(
				'id' => array(
					'type'              => 'integer',
					'required'          => true,
					'sanitize_callback' => 'absint',
				),
			),
		) );
	}

	public function rest_permission() {
		if ( ! is_user_logged_in() ) {
			return new WP_Error( 'lp_eqil_rest_forbidden', __( 'Authentication required.', 'lp-embed-quiz-in-lesson' ), array( 'status' => 401 ) );
		}
		return true;
	}

	public function rest_get_lesson( WP_REST_Request $request ) {
		$lesson_id = absint( $request['id'] );
		$lesson    = get_post( $lesson_id );
		if ( ! $lesson || 'lp_lesson' !== $lesson->post_type || 'publish' !== $lesson->post_status ) {
			return new WP_Error( 'lp_eqil_not_found', __( 'Lesson not found', 'lp-embed-quiz-in-lesson' ), array( 'status' => 404 ) );
		}

		$quiz_id      = absint( get_post_meta( $lesson_id, self::META_QUIZ_ID, true ) );
		$require_pass = ( get_post_meta( $lesson_id, self::META_REQUIRE_PASS, true ) === '1' );

		$quiz_data = null;
		if ( $quiz_id > 0 && 'lp_quiz' === get_post_type( $quiz_id ) ) {
			$quiz_data = array(
				'id'        => $quiz_id,
				'title'     => wp_strip_all_tags( get_the_title( $quiz_id ) ),
				'permalink' => esc_url_raw( get_permalink( $quiz_id ) ),
			);
		}

		return rest_ensure_response( array(
			'id'           => $lesson_id,
			'title'        => wp_strip_all_tags( get_the_title( $lesson_id ) ),
			'content'      => wp_kses_post( apply_filters( 'the_content', $lesson->post_content ) ),
			'quiz_id'      => $quiz_id > 0 ? $quiz_id : null,
			'require_pass' => $require_pass,
			'quiz'         => $quiz_data,
		) );
	}
}
