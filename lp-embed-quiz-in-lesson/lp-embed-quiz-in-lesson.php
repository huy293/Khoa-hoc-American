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

		register_rest_route( self::REST_NS, '/quiz/(?P<id>[a-zA-Z0-9\-_]+)', array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => array( $this, 'rest_get_quiz' ),
			'permission_callback' => array( $this, 'rest_permission' ),
		) );

		register_rest_route( self::REST_NS, '/quiz/(?P<id>[a-zA-Z0-9\-_]+)/submit', array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => array( $this, 'rest_submit_quiz' ),
			'permission_callback' => array( $this, 'rest_permission' ),
		) );
	}

	public function rest_permission() {
		// Allow server-to-server requests authenticated via HomeNest API Secret
		$hn_secret = defined( 'HN_API_SECRET' ) ? HN_API_SECRET : get_option( 'hn_api_secret', '' );
		if ( ! empty( $hn_secret ) ) {
			$headers = function_exists( 'getallheaders' ) ? getallheaders() : [];
			$sent_key = $headers['x-api-key'] ?? $headers['X-Api-Key'] ?? $headers['x-secret-key'] ?? $headers['X-Secret-Key'] ?? '';
			if ( empty( $sent_key ) ) {
				$sent_key = isset( $_SERVER['HTTP_X_API_KEY'] ) ? sanitize_text_field( $_SERVER['HTTP_X_API_KEY'] ) : '';
			}
			if ( ! empty( $sent_key ) && hash_equals( $hn_secret, $sent_key ) ) {
				return true;
			}
		}

		if ( is_user_logged_in() ) {
			return true;
		}

		return new WP_Error( 'lp_eqil_rest_forbidden', __( 'Authentication required.', 'lp-embed-quiz-in-lesson' ), array( 'status' => 401 ) );
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
				'slug'      => get_post_field( 'post_name', $quiz_id ),
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

	public function rest_get_quiz( WP_REST_Request $request ) {
		global $wpdb;
		$param_id  = $request['id'];
		$quiz_id   = absint( $param_id );
		$quiz_post = null;

		if ( $quiz_id > 0 ) {
			$quiz_post = get_post( $quiz_id );
		} else {
			$slug_clean = sanitize_title( $param_id );
			$quiz_post  = get_page_by_path( $slug_clean, OBJECT, 'lp_quiz' );
			if ( ! $quiz_post ) {
				$posts = get_posts( array(
					'name'        => $slug_clean,
					'post_type'   => 'lp_quiz',
					'post_status' => 'publish',
					'numberposts' => 1,
				) );
				if ( ! empty( $posts ) ) {
					$quiz_post = $posts[0];
				}
			}
			if ( $quiz_post ) {
				$quiz_id = $quiz_post->ID;
			}
		}

		if ( ! $quiz_post || 'lp_quiz' !== $quiz_post->post_type ) {
			return new WP_Error( 'lp_eqil_quiz_not_found', __( 'Quiz not found', 'lp-embed-quiz-in-lesson' ), array( 'status' => 404 ) );
		}

		// 1. Duration (LearnPress stores as '30 minute' or seconds)
		$raw_duration = get_post_meta( $quiz_id, '_lp_duration', true );
		$duration_seconds = 1800; // default 30 minutes
		if ( ! empty( $raw_duration ) ) {
			if ( is_numeric( $raw_duration ) ) {
				$duration_seconds = absint( $raw_duration );
			} elseif ( preg_match( '/(\d+)\s*(minute|min|m)/i', $raw_duration, $m ) ) {
				$duration_seconds = absint( $m[1] ) * 60;
			} elseif ( preg_match( '/(\d+)\s*(hour|h)/i', $raw_duration, $m ) ) {
				$duration_seconds = absint( $m[1] ) * 3600;
			} elseif ( preg_match( '/(\d+)\s*(second|sec|s)/i', $raw_duration, $m ) ) {
				$duration_seconds = absint( $m[1] );
			}
		}

		// 2. Passing Grade (e.g. '80%' or 80)
		$raw_passing = get_post_meta( $quiz_id, '_lp_passing_grade', true );
		$passing_grade = 80;
		if ( ! empty( $raw_passing ) ) {
			$passing_grade = absint( str_replace( '%', '', (string) $raw_passing ) );
		}

		// 3. Retrieve Questions
		$question_ids = array();
		if ( function_exists( 'learn_press_get_quiz' ) ) {
			$lp_quiz = learn_press_get_quiz( $quiz_id );
			if ( $lp_quiz && method_exists( $lp_quiz, 'get_question_ids' ) ) {
				$question_ids = $lp_quiz->get_question_ids();
			}
		}

		// Fallback: Query learnpress_quiz_questions table
		if ( empty( $question_ids ) ) {
			$table_qq = $wpdb->prefix . 'learnpress_quiz_questions';
			$table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table_qq ) );
			if ( $table_exists ) {
				$rows = $wpdb->get_col( $wpdb->prepare( "SELECT question_id FROM {$table_qq} WHERE quiz_id = %d ORDER BY question_order ASC", $quiz_id ) );
				if ( ! empty( $rows ) ) {
					$question_ids = array_map( 'absint', $rows );
				}
			}
		}

		// Fallback 2: Post parent or meta query
		if ( empty( $question_ids ) ) {
			$posts = get_posts( array(
				'post_type'      => 'lp_question',
				'posts_per_page' => 50,
				'post_status'    => 'publish',
				'fields'         => 'ids',
				'orderby'        => 'menu_order ID',
				'order'          => 'ASC',
			) );
			if ( ! empty( $posts ) ) {
				$question_ids = array_map( 'absint', $posts );
			}
		}

		// 4. Format Question Details
		$questions = array();
		$table_qa = $wpdb->prefix . 'learnpress_question_answers';
		$qa_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table_qa ) );

		foreach ( $question_ids as $q_id ) {
			$q_post = get_post( $q_id );
			if ( ! $q_post ) {
				continue;
			}

			$options = array();

			// Cách 1: Thử đọc trực tiếp từ postmeta _lp_answers (Chuẩn LearnPress 4 lưu cấu hình đáp án ở đây)
			$meta_answers = get_post_meta( $q_id, '_lp_answers', true );
			if ( ! empty( $meta_answers ) && ( is_array( $meta_answers ) || is_object( $meta_answers ) ) ) {
				$idx = 0;
				foreach ( (array) $meta_answers as $key => $item ) {
					$opt_title = '';
					$opt_id    = '';

					if ( is_array( $item ) ) {
						$opt_title = $item['text'] ?? $item['title'] ?? $item['label'] ?? '';
						$opt_id    = $item['value'] ?? $item['question_answer_id'] ?? $item['id'] ?? (string) $key;
					} elseif ( is_object( $item ) ) {
						if ( method_exists( $item, 'get_title' ) ) {
							$opt_title = $item->get_title();
						} elseif ( method_exists( $item, 'get_text' ) ) {
							$opt_title = $item->get_text();
						} else {
							$opt_title = $item->title ?? $item->text ?? $item->label ?? '';
						}

						if ( method_exists( $item, 'get_value' ) ) {
							$opt_id = $item->get_value();
						} elseif ( method_exists( $item, 'get_id' ) ) {
							$opt_id = $item->get_id();
						} else {
							$opt_id = $item->value ?? $item->question_answer_id ?? $item->id ?? (string) $key;
						}
					}

					if ( ! empty( $opt_title ) ) {
						$options[] = array(
							'id'    => (string) $opt_id,
							'title' => wp_strip_all_tags( (string) $opt_title ),
						);
					}
					$idx++;
				}
			}

			// Cách 2: Thử qua đối tượng LearnPress LP_Question (LearnPress 4 getter methods)
			if ( empty( $options ) && function_exists( 'learn_press_get_question' ) ) {
				$q_obj = learn_press_get_question( $q_id );
				if ( $q_obj && method_exists( $q_obj, 'get_answers' ) ) {
					$lp_answers = $q_obj->get_answers();
					if ( is_array( $lp_answers ) ) {
						foreach ( $lp_answers as $key => $ans ) {
							$opt_title = '';
							$opt_id    = '';

							if ( is_object( $ans ) ) {
								// Thử các method getter chuẩn của LP_Question_Answer
								if ( method_exists( $ans, 'get_title' ) ) {
									$opt_title = $ans->get_title();
								}
								if ( empty( $opt_title ) && method_exists( $ans, 'get_text' ) ) {
									$opt_title = $ans->get_text();
								}
								if ( method_exists( $ans, 'get_value' ) ) {
									$opt_id = $ans->get_value();
								}
								if ( empty( $opt_id ) && method_exists( $ans, 'get_id' ) ) {
									$opt_id = $ans->get_id();
								}

								// Fallback trực tiếp properties
								if ( empty( $opt_title ) ) {
									$opt_title = $ans->title ?? $ans->text ?? $ans->label ?? '';
								}
								if ( empty( $opt_id ) ) {
									$opt_id = $ans->value ?? $ans->question_answer_id ?? $ans->id ?? (string) $key;
								}

								// Thử ép kiểu sang array để đọc các thuộc tính private/protected
								if ( empty( $opt_title ) ) {
									$ans_arr = (array) $ans;
									foreach ( $ans_arr as $prop_k => $prop_v ) {
										if ( is_string( $prop_v ) && ! empty( $prop_v ) ) {
											if ( false !== stripos( $prop_k, 'title' ) || false !== stripos( $prop_k, 'text' ) ) {
												$opt_title = $prop_v;
											} elseif ( false !== stripos( $prop_k, 'value' ) && empty( $opt_id ) ) {
												$opt_id = $prop_v;
											}
										}
									}
								}
							} elseif ( is_array( $ans ) ) {
								$opt_title = $ans['text'] ?? $ans['title'] ?? $ans['label'] ?? '';
								$opt_id    = $ans['value'] ?? $ans['question_answer_id'] ?? $ans['id'] ?? (string) $key;
							}

							if ( ! empty( $opt_title ) ) {
								$options[] = array(
									'id'    => (string) $opt_id,
									'title' => wp_strip_all_tags( (string) $opt_title ),
								);
							}
						}
					}
				}
			}

			// Cách 3: Fallback query bảng learnpress_question_answers trong database
			if ( empty( $options ) && $qa_exists ) {
				$qa_rows = $wpdb->get_results( $wpdb->prepare(
					"SELECT * FROM {$table_qa} WHERE question_id = %d ORDER BY `order` ASC",
					$q_id
				), ARRAY_A );
				if ( ! empty( $qa_rows ) ) {
					foreach ( $qa_rows as $idx => $qa_row ) {
						$opt_title = $qa_row['title'] ?? $qa_row['text'] ?? '';
						$opt_id    = $qa_row['value'] ?? $qa_row['question_answer_id'] ?? (string) $idx;

						// Nếu LearnPress lưu dạng serialized trong cột answer_data
						if ( empty( $opt_title ) && ! empty( $qa_row['answer_data'] ) ) {
							$unpacked = maybe_unserialize( $qa_row['answer_data'] );
							if ( is_array( $unpacked ) ) {
								$opt_title = $unpacked['title'] ?? $unpacked['text'] ?? '';
								$opt_id    = $unpacked['value'] ?? $opt_id;
							}
						}

						if ( ! empty( $opt_title ) ) {
							$options[] = array(
								'id'    => (string) $opt_id,
								'title' => wp_strip_all_tags( (string) $opt_title ),
							);
						}
					}
				}
			}

			$questions[] = array(
				'id'          => $q_id,
				'title'       => wp_strip_all_tags( $q_post->post_title ),
				'content'     => wp_strip_all_tags( $q_post->post_content ),
				'type'        => get_post_meta( $q_id, '_lp_type', true ) ?: 'single_choice',
				'options'     => $options,
			);
		}

		return rest_ensure_response( array(
			'id'               => $quiz_id,
			'title'            => wp_strip_all_tags( $quiz_post->post_title ),
			'content'          => wp_strip_all_tags( $quiz_post->post_content ),
			'duration_seconds' => $duration_seconds,
			'passing_grade'    => $passing_grade,
			'questions_count'  => count( $questions ),
			'questions'        => $questions,
		) );
	}

	public function rest_submit_quiz( WP_REST_Request $request ) {
		global $wpdb;
		$param_id  = $request['id'];
		$quiz_id   = absint( $param_id );
		if ( ! $quiz_id ) {
			$slug_clean = sanitize_title( $param_id );
			$quiz_post  = get_page_by_path( $slug_clean, OBJECT, 'lp_quiz' );
			if ( ! $quiz_post ) {
				$posts = get_posts( array(
					'name'        => $slug_clean,
					'post_type'   => 'lp_quiz',
					'post_status' => 'publish',
					'numberposts' => 1,
				) );
				if ( ! empty( $posts ) ) {
					$quiz_post = $posts[0];
				}
			}
			if ( $quiz_post ) {
				$quiz_id = $quiz_post->ID;
			}
		}
		$params    = $request->get_json_params() ?: $_POST;
		$user_id   = absint( $params['user_id'] ?? get_current_user_id() );
		$course_id = absint( $params['course_id'] ?? 0 );
		$lesson_id = absint( $params['lesson_id'] ?? 0 );
		$answers   = isset( $params['answers'] ) && is_array( $params['answers'] ) ? $params['answers'] : array();

		$raw_passing   = get_post_meta( $quiz_id, '_lp_passing_grade', true );
		$passing_grade = 80;
		if ( ! empty( $raw_passing ) ) {
			$passing_grade = absint( str_replace( '%', '', (string) $raw_passing ) );
		}

		$table_qa  = $wpdb->prefix . 'learnpress_question_answers';
		$qa_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table_qa ) );

		// Lấy toàn bộ danh sách question_id của bài quiz từ LearnPress
		$all_question_ids = array();
		if ( function_exists( 'learn_press_get_quiz' ) ) {
			$lp_quiz = learn_press_get_quiz( $quiz_id );
			if ( $lp_quiz && method_exists( $lp_quiz, 'get_question_ids' ) ) {
				$all_question_ids = $lp_quiz->get_question_ids();
			}
		}
		if ( empty( $all_question_ids ) ) {
			$table_qq = $wpdb->prefix . 'learnpress_quiz_questions';
			$table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table_qq ) );
			if ( $table_exists ) {
				$rows = $wpdb->get_col( $wpdb->prepare( "SELECT question_id FROM {$table_qq} WHERE quiz_id = %d ORDER BY question_order ASC", $quiz_id ) );
				if ( ! empty( $rows ) ) {
					$all_question_ids = array_map( 'absint', $rows );
				}
			}
		}
		if ( empty( $all_question_ids ) ) {
			$all_question_ids = ! empty( $answers ) ? array_map( 'absint', array_keys( $answers ) ) : array();
		}

		$results_detail = array();
		$correct_count  = 0;
		$total_questions = count( $all_question_ids );

		foreach ( $all_question_ids as $q_id ) {
			$q_id = absint( $q_id );
			$selected_ans_id = isset( $answers[ $q_id ] ) ? (string) $answers[ $q_id ] : ( isset( $answers[ (string) $q_id ] ) ? (string) $answers[ (string) $q_id ] : '' );
			$is_correct = false;
			$correct_ans_id = null;

			// Method 1: Check via postmeta _lp_answers
			$meta_answers = get_post_meta( $q_id, '_lp_answers', true );
			if ( ! empty( $meta_answers ) && ( is_array( $meta_answers ) || is_object( $meta_answers ) ) ) {
				foreach ( (array) $meta_answers as $key => $item ) {
					$is_t = is_array( $item ) ? ( $item['is_true'] ?? '' ) : ( $item->is_true ?? '' );
					if ( 'yes' === $is_t || 1 === (int) $is_t || true === $is_t ) {
						$correct_ans_id = (string) ( is_array( $item ) ? ( $item['value'] ?? $item['question_answer_id'] ?? $item['id'] ?? $key ) : ( $item->value ?? $item->question_answer_id ?? $item->id ?? $key ) );
						break;
					}
				}
			}

			// Method 2: Check via LearnPress question class
			if ( null === $correct_ans_id && function_exists( 'learn_press_get_question' ) ) {
				$q_obj = learn_press_get_question( $q_id );
				if ( $q_obj && method_exists( $q_obj, 'get_answers' ) ) {
					$lp_answers = $q_obj->get_answers();
					if ( is_array( $lp_answers ) ) {
						foreach ( $lp_answers as $key => $ans ) {
							$ans_id = '';
							$is_true = false;

							if ( is_object( $ans ) ) {
								$is_true = method_exists( $ans, 'is_true' ) ? $ans->is_true() : ( $ans->is_true ?? false );
								if ( method_exists( $ans, 'get_value' ) ) {
									$ans_id = $ans->get_value();
								} elseif ( method_exists( $ans, 'get_id' ) ) {
									$ans_id = $ans->get_id();
								} else {
									$ans_id = $ans->value ?? $ans->question_answer_id ?? $ans->id ?? (string) $key;
								}
							} elseif ( is_array( $ans ) ) {
								$is_true = ( 'yes' === ( $ans['is_true'] ?? '' ) || 1 === (int) ( $ans['is_true'] ?? 0 ) );
								$ans_id  = $ans['value'] ?? $ans['question_answer_id'] ?? $ans['id'] ?? (string) $key;
							}

							if ( $is_true || 'yes' === $is_true || 1 === (int) $is_true ) {
								$correct_ans_id = (string) $ans_id;
								break;
							}
						}
					}
				}
			}

			// Method 3: Query DB table
			if ( null === $correct_ans_id && $qa_exists ) {
				$correct_row = $wpdb->get_row( $wpdb->prepare(
					"SELECT question_answer_id, value FROM {$table_qa} WHERE question_id = %d AND is_true = 'yes' LIMIT 1",
					$q_id
				) );
				if ( $correct_row ) {
					$correct_ans_id = (string) ( $correct_row->question_answer_id ?: $correct_row->value );
				}
			}

			if ( ! empty( $correct_ans_id ) && (string) $correct_ans_id === (string) $selected_ans_id ) {
				$is_correct = true;
				$correct_count++;
			}

			$results_detail[] = array(
				'question_id'        => $q_id,
				'selected_answer_id' => (string) $selected_ans_id,
				'correct_answer_id'  => $correct_ans_id,
				'is_correct'         => $is_correct,
			);
		}

		$score = ( $total_questions > 0 ) ? round( ( $correct_count / $total_questions ) * 100, 1 ) : 0;
		$passed = ( $score >= $passing_grade );

		// If passed and user provided, auto complete lesson!
		if ( $passed && $user_id > 0 ) {
			if ( $lesson_id > 0 && function_exists( 'learn_press_get_user' ) ) {
				$user = learn_press_get_user( $user_id );
				if ( $user && method_exists( $user, 'complete_lesson' ) ) {
					try {
						$user->complete_lesson( $lesson_id, $course_id );
					} catch ( Exception $e ) {
						// silent
					}
				}
			} else {
				$this->auto_complete_lesson( $quiz_id, $course_id, $user_id );
			}
		}

		return rest_ensure_response( array(
			'success'         => true,
			'quiz_id'         => $quiz_id,
			'score'           => $score,
			'passing_grade'   => $passing_grade,
			'passed'          => $passed,
			'correct_count'   => $correct_count,
			'total_questions' => $total_questions,
			'results'         => $results_detail,
		) );
	}
}
