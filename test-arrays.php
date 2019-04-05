<?php
error_reporting( E_ALL );
function array_clone($array) {
  return array_map(function($element) {
    return ((is_array($element))
      ? array_clone($element)
      : ((is_object($element))
        ? clone $element
        : $element
      )
    );
  }, $array);
}

$needed_layout = array( 'default', 'tablet', 'mobile' );
$founded_layouts = array( 'default', 'peter-custom' );
foreach( $founded_layouts as $layout )
{
    $index = array_search( $layout, $needed_layout );
    if ( false !== $index )
    {
        unset( $needed_layout[$index] );
    }
}

$settings = '[{' .
    '\"section_rex_id\":\"Ok3j\",' .
    '\"targets\":[' .
      '{' .
        '\"name\":\"self\",' .
        '\"props\":{' .
          '\"collapse_grid\":false,' .
          '\"grid_cell_width\":1,' .
          '\"section_name\":\"\",' .
          '\"type\":\"perfect-grid\",' .
          '\"color_bg_section\":\"\",' .
          '\"color_bg_section_active\":true,' .
          '\"dimension\":\"full\",' .
          '\"margin\":\"\",' .
          '\"image_bg_section_active\":true,' .
          '\"image_bg_section\":\"\",' .
          '\"image_width\":\"\",' .
          '\"image_height\":\"\",' .
          '\"id_image_bg_section\":\"\",' .
          '\"video_bg_id\":\"\",' .
          '\"video_mp4_url\":\"\",' .
          '\"video_bg_url_section\":\"\",' .
          '\"video_bg_url_vimeo_section\":\"\",' .
          '\"full_height\":\"false\",' .
          '\"block_distance\":20,' .
          '\"layout\":\"fixed\",' .
          '\"custom_classes\":\"rexpansive_portfolio_presentation\",' .
          '\"section_width\":\"none\",' .
          '\"row_separator_top\":20,' .
          '\"row_separator_bottom\":20,' .
          '\"row_separator_right\":20,' .
          '\"row_separator_left\":20,' .
          '\"row_margin_top\":0,' .
          '\"row_margin_bottom\":0,' .
          '\"row_margin_right\":0,' .
          '\"row_margin_left\":0,' .
          '\"row_overlay_color\":\"\",' .
          '\"row_overlay_active\":false,' .
          '\"rexlive_model_id\":\"\",' .
          '\"rexlive_model_name\":\"\",' .
          '\"section_edited\":true,' .
          '\"gridEdited\":false' .
        '}' .
      '}' .
    '],' .
    '\"section_is_model\":false,' .
    '\"section_model_id\":\"\",' .
    '\"section_model_number\":-1,' .
    '\"section_hide\":false,' .
    '\"section_created_live\":false' .
'}]';

$obj1 = json_decode(stripslashes($settings));
var_dump($obj1);

$opts = array(
  'collapse_grid' => true,
  'layout' => 'masonry'
);
foreach( $opts as $prop => $val )
{
  $obj1[0]->targets[0]->props->$prop = $val;
}
var_dump($obj1);

echo "\n";