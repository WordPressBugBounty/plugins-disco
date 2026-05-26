<?php

/**
 * This class is responsible for all campaign related database operation.
 *
 * @package    Disco
 */

namespace Disco\App;

use Disco\App\Utility\Config;

/**
 * Class Campaign
 *
 * @package    Disco
 * @subpackage App
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Campaign
 */
class Campaign {

    /**
     * Get campaigns from database.
     *
	 * @param string $status Campaign status.
	 * @param string $intent Campaign intent.
	 * @return array
	 * @since 1.0.0
	 */
	public function get_campaigns( $status = null, $intent = null ) {//phpcs:ignore
		$campaigns = $this->get_rows();

		if ( ! is_array( $campaigns ) ) {
			return array();
		}

		$filtered_campaigns = array_filter(
			$campaigns,
			static function ( $campaign ) use ( $status, $intent ) {
				if ( ! isset( $campaign->status ) ) {
					return false;
				}

				if ( ! isset( $campaign->intent ) ) {
					return false;
                }

                if ( ! is_object( $campaign ) ) {
                    return false;
                }

                if ( ! is_null( $status ) && $status !== $campaign->status ) {
                    return false;
                }

                if ( is_array( $intent ) ) {
                    return in_array( $campaign->intent, $intent, true );
                }

                return is_null( $intent ) || $intent === $campaign->intent;
            }
        );

        $results = array_map(
            static function ( $campaign ) {
                if ( isset( $campaign->data, $campaign->id ) ) {
                    $data       = json_decode( $campaign->data, true );
                    $data       = (array) $data;
                    $data['id'] = $campaign->id;

                    return new Config( $data );
                }

                return false;
            },
            $filtered_campaigns
        );

        $results = array_combine( array_column( $results, 'id' ), $results );

        if ( is_array( $results ) ) {
            return $results;
        }

        return array();
    }

    /**
     * Get a campaign by id.
     *
     * @param int|mixed $id Campaign id.
     * @return \Disco\App\Utility\Config|\WP_Error
     * @since 1.0.0
     */
    public function get_campaign( $id ) {
        $campaigns = $this->get_rows();
        $campaigns = (array) $campaigns;
        $id        = absint( $id );

        if ( isset( $campaigns[ $id ] ) ) {
            $campaign = $campaigns[ $id ];
        } else {
            // Get Campaign from cache or fetch from DB.
            $campaign = $this->get_row( $id );
        }

        // Return the campaign from cache.
        if ( $campaign instanceof Config ) {
            return $campaign;
        }

        if ( ! $campaign ) {
            return new \WP_Error(
                'rest_not_found',
                __( 'Sorry, Invalid campaign id.', 'disco' ),
                array( 'status' => 400 )
            );
        }

        if ( isset( $campaign->data ) ) {
            $campaign       = json_decode( $campaign->data, true );
            $campaign       = (array) $campaign;
            $campaign['id'] = $id;

            return new Config( $campaign );
        }

        return new \WP_Error(
            'rest_not_found',
            __( 'Sorry, Invalid campaign data.', 'disco' ),
            array( 'status' => 400 )
        );
    }

    /**
     * Save campaign into database.
     *
     * @param array $config Campaign config.
     * @return \WP_Error|\Disco\App\Utility\Config
     * @since 1.0.0
     */
	public function save_campaign( $config ) {//phpcs:ignore
        if ( is_user_logged_in() ) {
            $config['created_by']  = get_current_user_id();
            $config['modified_by'] = get_current_user_id();
        }

        if ( empty( $config['status'] ) ) {
            $config['status'] = '0';
        }

        $config['created_date']  = gmdate( 'Y-m-d H:i:s' );
        $config['modified_date'] = gmdate( 'Y-m-d H:i:s' );
        // ==================================.
        $campaign_id = $this->insert( $config );
        // ==================================.
        // Get Campaign from cache or fetch from DB.
        $campaign = $this->get_row( $campaign_id );

        if ( ! $campaign ) {
            return new \WP_Error(
                'rest_not_added',
                __( 'Sorry, Failed to Save Campaign.', 'disco' ),
                array( 'status' => 400 )
            );
        }

        $data = array();

        if ( isset( $campaign->data, $campaign->id ) ) {
            $data       = (array) json_decode( $campaign->data, true );
            $data['id'] = absint( $campaign->id );
        }

        return new Config( $data );
    }

	/**
	 * Update campaign into database.
	 *
	 * @param int   $id     Campaign id.
	 * @param array $config Campaign config.
     * @return \Disco\App\Utility\Config|\WP_Error
	 * @throws \Exception If the campaign is not found.
	 * @since 1.0.0
	 */
    public function update_campaign( $id, $config ) {
        $id = absint( $id );

        if ( is_user_logged_in() ) {
            $config['modified_by'] = get_current_user_id();
        }

        $config['modified_date'] = gmdate( 'Y-m-d H:i:s' );
        // Get Campaign from cache or fetch from DB.
        $campaign = $this->get_row( $id );

		if ( ! $campaign ) {
			return new \WP_Error(
				'rest_not_found',
				__( 'Sorry, Invalid campaign id.', 'disco' ),
				array( 'status' => 400 )
			);
		}

        if ( ! isset( $config['status'] ) && ! empty( $campaign->status ) ) {
            $config['status'] = $campaign->status;
        }

        if ( ! isset( $config['priority'] ) && ! empty( $campaign->priority ) ) {
            $config['priority'] = $campaign->priority;
        }

        // Update campaign into database.
        $update = $this->update( $config, $id );

        if ( ! $update ) {
            return new \WP_Error(
                'rest_not_added',
                __( 'Sorry, the campaign could not be updated.', 'disco' ),
                array( 'status' => 400 )
            );
        }

        $data = array();

        if ( isset( $campaign->data ) && isset( $campaign->id ) ) {
            $data       = (array) json_decode( $campaign->data, true );
            $data['id'] = absint( $campaign->id );
        }

        return new Config( $data );
    }

    /**
     * Delete campaign from database.
     *
     * @param int $id Campaign id.
     * @return int|bool
     * @since 1.0.0
     */
    public function delete_campaign( $id ) {
        return $this->delete( $id );
    }

    /**
     * Insert campaign into database.
     *
     * @param array $config Campaign config.
     * @return int
     * @since 1.0.0
     */
    public function insert( $config ) {
        global $wpdb;

		$insert = $wpdb->insert( //phpcs:ignore
            "{$wpdb->prefix}disco_campaigns",
            array(
                'intent' => $config['discount_intent'],
                'status' => $config['status'],
                'data'   => wp_json_encode( $config ),
            ),
            array(
				'%s',
				'%s',
				'%s',
            )
        );

        if ( $insert ) {
            return $wpdb->insert_id;
        }

        return 0;
    }

    /**
     * Update campaign into database.
     *
     * @param array $config Campaign config.
     * @param int   $id     Campaign id.
     * @return bool|int
     * @since 1.0.0
     */
    public function update( $config, $id ) {
        global $wpdb;

        $table_name = $wpdb->prefix . 'disco_campaigns';

		return $wpdb->update(  //phpcs:ignore
            $table_name,
            array(
                'intent'   => $config['discount_intent'],
                'status'   => $config['status'],
                'priority' => $config['priority'],
                'data'     => wp_json_encode( $config ),
            ),
            array( 'id' => $id ),
            array(
                '%s',
                '%s',
                '%s',
                '%s',
            ),
            array( '%d' )
        );
    }

    /**
     * Delete campaign from database.
     *
     * @param int $id Campaign id.
     * @return bool|int
     * @since 1.0.0
     */
    public function delete( $id ) {
        global $wpdb;

        $table_name = $wpdb->prefix . 'disco_campaigns';

		return $wpdb->delete( $table_name, array( 'id' => $id ), array( '%d' ) );//phpcs:ignore
    }

    /**
     * Get all rows from database.
     *
     * @noinspection SqlResolve
     * @return array|null
     * @since        1.0.0
     */
    public function get_rows() {
        global $wpdb;
        // Get all rows
		$get_campaigns = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}disco_campaigns", OBJECT ); //phpcs:ignore
        $campaigns     = array();

        foreach ( $get_campaigns as $result ) {
            $campaigns[ $result->id ] = $result;
        }

        return $campaigns;
    }

    /**
     * Single Row Query by id.
     * First check if the row is available in cache.
     * If not, then fetch from the database.
     *
     * @noinspection SqlResolve
     * @param int $id Campaign id.
     * @return object|null
     * @since        1.0.0
     */
    public function get_row( $id ) {
        global $wpdb;
		$query = $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}disco_campaigns WHERE id = %d", $id ); //phpcs:ignore

		return $wpdb->get_row( $query, OBJECT );//phpcs:ignore
    }

}
