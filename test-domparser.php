<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PARSING STRINGS LIKE JS</title>
</head>
<body>
    <div id="id-post" data-post-id="1"></div>
<?php
// simple product
$simple_product_price = '<p class="price"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">£</span>109.95</span></p>';

// sale product
$sale_product_price = '<p class="price"><del><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">£</span>279.99</span></del><ins><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">£</span>229.99</span></ins></p>';

// variable product
$variable_product_price = '<p class="price"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">£</span>49.99</span> – <span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">£</span>99.95</span></p>';

// data-editable-info='{"table":"postmeta","field":"_regular_price"}' data-editable-type="float"
// data-editable-info='{"table":"postmeta","field":"_sale_price"}' data-editable-type="float"

$classname = 'woocommerce-Price-amount';
$dom = new DOMDocument();
$dom->loadHTML( mb_convert_encoding( $simple_product_price, 'HTML-ENTITIES', 'UTF-8' ) );

$xpath = new DOMXPath($dom);
$price_nodes = $xpath->query("//*[contains(@class, '$classname')]");
$del_price = $dom->getElementsByTagName('del');

$price_type = '';
if ( 1 === $price_nodes->length && 0 === $del_price->length ) {
    $price_type = 'simple';
} else if ( 2 === $price_nodes->length && 1 === $del_price->length ) {
    $price_type = 'sale';
} else if ( 2 === $price_nodes->length && 0 === $del_price->length ) {
    $price_type = 'variable';
}

if ( 'variable' !== $price_type && '' !== $price_type ) {
    foreach( $price_nodes as $price ) {
        foreach( $price->childNodes as $child ) {
            if ( 3 === $child->nodeType ) {
                $editable_price = $dom->createElement( 'span',$child->textContent );
                $editable_price->setAttribute( 'class', 'builderlive-editable-field' );
                $editable_price->setAttribute( 'data-editable-type', 'float' );
                $editable_price->setAttribute( 'data-editable-format', 'x.x,x' );
                if ( 'simple' === $price_type ) {
                    $editable_price->setAttribute( 'data-editable-info', '[{"table":"postmeta","field":"_regular_price"}]' );
                } else if ( 'sale' === $price_type ) {
                    if ( 'ins' === strtolower( $price->parentNode->tagName ) ) {
                        $editable_price->setAttribute( 'data-editable-info', '[{"table":"postmeta","field":"_sale_price"}]' );
                    } else if ( 'del' === strtolower( $price->parentNode->tagName ) ) {
                        $editable_price->setAttribute( 'data-editable-info', '[{"table":"postmeta","field":"_regular_price"}]' );
                    }
                }
                $child->parentNode->replaceChild( $editable_price, $child );
            }
        }
    }
}

$test = $dom->saveHTML();

$gallery_thumb = '<div data-thumb="http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front-100x100.jpg" data-thumb-alt="" class="woocommerce-product-gallery__image"><a href="http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front.jpg"><img width="600" height="600" src="http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front-600x600.jpg" class="wp-post-image" alt="" title="hoodie_7_front.jpg" data-caption="" data-src="http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front.jpg" data-large_image="http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front.jpg" data-large_image_width="1000" data-large_image_height="1000" srcset="http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front-600x600.jpg 600w, http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front-300x300.jpg 300w, http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front-150x150.jpg 150w, http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front-768x768.jpg 768w, http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front-100x100.jpg 100w, http://localhost:8888/local/wp-content/uploads/2019/01/hoodie_7_front.jpg 1000w" sizes="(max-width: 600px) 100vw, 600px" /></a></div>';

$attachment_id = 376;

$dom = new DOMDocument();
$dom->loadHTML( mb_convert_encoding( $gallery_thumb, 'HTML-ENTITIES', 'UTF-8' ) );
$xpath = new DOMXPath($dom);

$classname = 'woocommerce-product-gallery__image';
$gallery_node = $xpath->query("//*[contains(@class, '$classname')]");

foreach( $gallery_node as $node ) {
    $temp = $node->getAttribute( 'class' );
    $node->setAttribute( 'class', $temp . ' builderlive-editable-field' );
    $node->setAttribute( 'data-editable-type', 'media' );
    $node->setAttribute( 'data-editable-value', $attachment_id );
    $node->setAttribute( 'data-editable-info', '[{"table":"postmeta","field":"_thumbnail_id"}]' );
}

$test2 = $dom->saveHTML();
echo $test2;

?>
<script src="./public/js/live/4-Rexbuilder_Live_Post_Edit.js"></script>
</body>
</html>