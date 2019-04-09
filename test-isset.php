<?php
error_reporting( E_ALL );

$grid = array( 0, 1, 2, 3, 4, 8, 10, 12, 13, 14 );

$holes = array( 5, 8, 12 );
$holes_length = count( $holes );

for ($z = 0; $z < $holes_length; $z++)
{
    echo "{$z} \n";
    $s_index = $holes[$z];
    $e_index = $s_index + 1;
    if ( isset( $grid[$s_index] ) && isset( $grid[$e_index] ) )
    {
        for ($w = $grid[$holes[$z]] + 1; $w < $grid[$holes[$z] + 1]; $w++)
        {
            echo "cycling {$z} \n";
        }
    }
}