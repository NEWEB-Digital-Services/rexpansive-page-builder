<?php
/**
 * Class to reorder a grid with a find-first-optimal-place algorithm
 * @since 2.0.0
 */
class Rexbuilder_Indexed_Grid 
{
	/**
	 * Store a grid as an array
	 *
	 * @var array
	 * @since 2.0.0
	 */
	protected $grid;
	
	/**
	 * Grid max width
	 *
	 * @var int
	 * @since 2.0.0
	 */
	protected $maxWidth;

	/**
	 * Indexed grid constructor: create an empty array, set a max width
	 *
	 * @param integer $maxWidth
	 * @since 2.0.0
	 */
	public function __construct( $maxWidth = 12 )
	{
		$this->grid = array();
		$this->maxWidth = $maxWidth;
	}

	/**
	 * Insertion sort algorithm on the grid
	 *
	 * @return void
	 * @since 2.0.0
	 */
	protected function insertionSort() 
	{
		$length = count( $this->grid );

		for ($i = 1, $j; $i < $length; $i++) 
		{
			$temp = $this->grid[$i];
			for ($j = $i - 1; $j >= 0 && $this->grid[$j] > $temp; $j--)
			{
				$this->grid[$j + 1] = $this->grid[$j];
			}
			$this->grid[$j + 1] = $temp;
		}
	}

	/**
	 * Set the array-grid with an element defined by
	 * [x,y] coordinates, width and height
	 *
	 * @param int $x
	 * @param int $y
	 * @param int $w
	 * @param int $h
	 * @return void
	 * @since 2.0.0
	 */
	public function setGrid($x, $y, $w, $h)
	{
		for ($i = 0; $i < $h; $i++)
		{
			for ($j = 0; $j < $w; $j++)
			{
				array_push( $this->grid, ($x + $j) + (($y + $i) * $this->maxWidth) );
			}
		}
		$this->insertionSort();
	}

	/**
	 * Check on the grid if there are empty spaces before some point
	 * Fill them if there are then reorder the grid
	 *
	 * @param int $place
	 * @return void
	 * @since 2.0.0
	 */
	public function checkGrid( $place )
	{
		$i = 0;
		while ($this->grid[$i] < $place)
		{
			$last = $this->grid[$i];
			if (($last+1) !== $this->grid[$i + 1])
			{
				array_push( $this->grid, $last + 1 );
			}
			$i++;
		}
  		$this->insertionSort();
	}
	
	/**
	 * Check in the array-grid the first available position for a block
	 * with a certain widht and height
	 *
	 * @param int $width
	 * @param int $height
	 * @return int
	 * @since 2.0.0
	 * @edit 09-05-2019	Add controls to prevent array indexing warnings
	 */
	public function willFit( $width, $height )
	{
		if( 0 == count( $this->grid ) )
		{
			return 0;
		}

		$holes = $this->findHoles();
		$holes_length = count( $holes );

		// Search in the holes for a free space
		for ($z = 0; $z < $holes_length; $z++)
		{
			$s_index = $holes[$z];
			$e_index = $holes[$z] + 1;
			if ( isset( $this->grid[$s_index] ) && isset( $this->grid[$e_index] ) )
			{
				for ($w = $this->grid[$s_index] + 1; $w < $this->grid[$e_index]; $w++)
				{
					$free = $this->searchFreeSpace($w, $width, $height);
					if ($free) { return $w; }
				}
			}
		}

		// No free spaces in the holes
		// Search the index starting from the last non-free index
		$lastFreeElement = $this->grid[count($this->grid) - 1] + 1;
		$startRow = floor(($lastFreeElement) / $this->maxWidth);
		$endRow = floor((($lastFreeElement) + ($width - 1)) / $this->maxWidth);

		while ($startRow !== $endRow)
		{
			$lastFreeElement = $lastFreeElement + 1;
			$startRow = floor(($lastFreeElement) / $this->maxWidth);
			$endRow = floor((($lastFreeElement) + ($width - 1)) / $this->maxWidth);
		}

		return $lastFreeElement;
	}

	/**
	 * Find the possibile holes on the array-grid
	 *
	 * @return int
	 * @since 2.0.0
	 */
	protected function findHoles()
	{
		$result = [];
		$grid_lenght = count( $this->grid );
		for ($i = 0; $i < $grid_lenght; $i++)
		{
			if ( !isset( $this->grid[$i + 1] ) || ( $this->grid[$i] + 1 !== $this->grid[$i + 1] ) )
			{
			  	array_push( $result, $i );
		  	}
		}
		return $result;
	}

	/**
	 * Check if a block can stay on a start position
	 *
	 * @param int $start
	 * @param int $width
	 * @param int $height
	 * @return bool
	 * @since 2.0.0
	 */
	protected function searchFreeSpace($start, $width, $height)
	{
		// Check if the element overflows the grid
		$startRow = floor(($start) / $this->maxWidth);
		$endRow = floor(($start + $width - 1) / $this->maxWidth);
	  
		if ($startRow !== $endRow)
		{
		  	return false;
		}
	  
		// Check if the element fits or the spaces are already occupied
		for ($i = 0; $i < $height; $i++)
		{
			  for ($j = 0; $j < $width; $j++)
			  {
				$temp = $start + $j + ($i * $this->maxWidth);
				if (false !== array_search( $temp, $this->grid ) )
				{
			  		return false;
				}
		  	}
		}
	  
		return true;
	}

	/**
	 * Translate a value to a coordinate on a grid
	 *
	 * @param int $val
	 * @param int $maxWidth
	 * @return array
	 * @since 2.0.0
	 */
	public static function getCoord( $val, $maxWidth )
	{
		return array(
			'x' => $val % $maxWidth,
			'y' => (int)floor( $val / $maxWidth )
		);
	}
}