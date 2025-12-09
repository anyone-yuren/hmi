export const safetyData = {
  vehicle_outline: {
    rectangle_list: [
      {
        id: 1,
        name: 'head',
        rectangle: [0, -500, 500, 500],
        is_active: false,
        associated_device: 0,
      },
      {
        id: 2,
        name: 'forkarm',
        rectangle: [-1000, -300, 0, 300],
        is_active: true,
        associated_device: 1,
      },
    ],
  },

  strategy_line_keep: {
    steer_angle_tolerance: 15,
  },
  strategy_under_fork_protection: {
    rectangle: [-1000, -500, -200, 500],
    min_forkarm_height_to_open_this: 500,
    height_start: 100,
    forkarm_height_cut: 300,
    min_distance_to_task_point_close_this: 1500,
    associated_sensor_list: ['Lidar3d_17'],
  },
  strategy_place_cargo_space_protection: {
    min_forkarm_height_to_open_this: 500,
    cuboid: [10, 11, 12, 20, 21, 22],
    associated_sensor_list: ['tail_lidar', 'perception_3d_lidar'],
    min_distance_to_task_point_open_this: 1000,
  },
  strategy_pick_cargo_fork_tip_protection: {
    rectangles: [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
    ],
    associated_sensor_list: ['tip_camera', 'perception_3d_lidar'],
    min_distance_to_task_point_open_this: 1000,
  },
  strategy_end_path_adaptive_reduce_range: {
    forward_min_protect_distance: 150,
    backward_min_protect_distance: 100,
  },
  strategy_top_protection: {
    empty_load_protect_cuboid: [400, -300, 2100, 1100, 300, 2400],
    full_load_protect_cuboid: [400, -300, 2100, 1100, 300, 2400],
    associated_sensor_list: ['head'],
  },
  strategy_door_frame_move_protection: {
    fork_forward_protect_distance: 1000,
    fork_lateral_move_protect_distance: 0,
    associated_io_sensor_list: ['pe_tip_left', 'pe_tip_right'],
  },
  strategy_end_path_close_protection: {
    list: [
      {
        id: 1,
        pick_cargo_pe_close_distance: 400,
        place_cargo_pe_close_distance: 400,
        pick_cargo_pc_close_distance: 400,
        place_cargo_pc_close_distance: 400,
        associated_io_sensor_list: ['pe_tip_left', 'pe_tip_right'],
        associated_pc_sensor_list: ['tip_camera', 'perception_3d_lidar'],
      },
      {
        id: 2,
        pick_cargo_pe_close_distance: 400,
        place_cargo_pe_close_distance: 400,
        pick_cargo_pc_close_distance: 400,
        place_cargo_pc_close_distance: 400,
        associated_io_sensor_list: ['pe_tip_left', 'pe_tip_right'],
        associated_pc_sensor_list: ['tip_camera', 'perception_3d_lidar'],
      },
    ],
  },
  strategy_amr_load_protection: {
    rack_leg_diameter: 40,
    amr_height: 300,
  },
  obs_scheme: {
    scheme_list: [
      {
        id: 1,
        name: 'go_charge',
        forward_stop_distance: 500,
        backward_stop_distance: 500,
        rotate_stop_distance: 500,
        ground_filter_height: 50,
        strategy_list: [1, 2, 6],
        strategy_end_path_close_protection: 1,
        pc_sensor_list: ['tip_camera', 'perception_3d_lidar', 'top_lidar'],
        io_sensor_list: ['pe_tip_left', 'pe_tip_right'],
        close_ce_lidar_list: [1, 2],
        protect_areas: [
          {
            id: 5,
            name: 'fork_arm',
            rectangle: [100, 200, 300, 400],
          },
          {
            id: 2,
            name: 'head',
            rectangle: [500, 600, 700, 800],
          },
        ],
      },
      {
        id: 2,
        name: 'normal_run',
        forward_stop_distance: 500,
        backward_stop_distance: 500,
        rotate_stop_distance: 500,
        ground_filter_height: 50,
        strategy_list: [1, 2],
        sensor_list: ['tip_camera', 'perception_3d_lidar', 'top_lidar'],
        protect_areas: [
          {
            id: 5,
            name: 'fork_arm',
            rectangle: [1, 2, 3, 4],
          },
          {
            id: 2,
            name: 'head',
            rectangle: [5, 6, 7, 8],
          },
        ],
      },
    ],
  },
};
