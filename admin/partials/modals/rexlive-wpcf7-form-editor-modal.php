<?php
/**
 * Modal for RexButton editing
 *
 * @since x.x.x
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
	<div id="rex-wpcf7-form-editor" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
		<!-- Closing button -->
				<div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="<?php esc_attr_e( 'Close', 'rexpansive-builder' ); ?>">
						<span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
				</div>
				<!-- General wrap -->
				<div class="modal-content">
					<?php include 'rexlive-loader-modal.php'; ?>
						<div class="rexpansive-accordion-outer close"> <!-- // Form Accordion -->
								<div class="bl_modal-row rex-wpcf7-modal-row-tall rex-accordion-outer--toggle">
										<div class="rexwpcf7-cont_row bl_ai-c bl_jc-c valign-wrapper">
												<div class="rex-wpcf7-accordion-outer-plus-wrap bl_d-iblock">
														<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
												</div>
												<div class="rex-wpcf7-title-icon l-icon--dark-grey bl_d-iblock">
														<?php Rexbuilder_Utilities::get_icon('#B022-Form-Border'); ?>
												</div>
												<div class="bl_d-iblock modal-accordion-title">form</div>
										</div>
								</div>
								<div class="rex-accordion-outer--content" style="display:none;" data-item-status="close">
										<div class="bl-modal-row"> <!-- // Form Settings -->
												<div class="bl_modal-row rex-wpcf7-modal-row-tall modal-row-grey"> <!-- // E-Mail -->
														<div class="rexwpcf7-cont_row">
																<div class="input-field pl4 rex-input-prefixed tippy" data-tippy-content="<?php _e('E-Mail', 'rexpansive-builder');?>">
																		<span class="prefix">
																				<?php Rexbuilder_Utilities::get_icon('#B018-Mail'); ?>
																		</span>
																		<input type="text" id="rex-wpcf7-mail-to" name="rex-wpcf7-mail-to" class="">
																		<label for="rex-wpcf7-mail-to">
																				<?php _e('E-Mail', 'rexpansive-builder');?>
																		</label>
																</div>
														</div>
												</div>
												<div class="bl_modal-row modal-row-grey"> <!-- // Form Margins, Columns Padding -->
														<div class="bl_modal__option-wrap bl_jc-c no_pad_lr">
																<div>
																		<div class="bl_d-flex bl_jc-c riga-1">
																				<div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Top', 'rexpansive-builder' ); ?>">
																						<input type="text" id="rex-wpcf7-margin-top" class="form-margin-values" name="rex-wpcf7-margin-top" placeholder="0"/>
																						<span class="bl_input-indicator">px</span>
																				</div> <!-- // Form margin top -->
																		</div>
																		<div class="bl_d-flex bl_ai-c bl_jc-sb riga-2">
																				<div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Left', 'rexpansive-builder' ); ?>">
																						<input type="text" id="rex-wpcf7-margin-left" class="form-margin-values" name="rex-wpcf7-margin-left" placeholder="0"/>
																						<span class="bl_input-indicator">px</span>
																				</div> <!-- // Form margin left -->
																				<div class="rex-live__row-padding-wrap valign-wrapper modal-form-wrapper">
																						<div class="modal-form-form-title">form</div>
																						<div class="modal-form-column-wrapper lateral bl_d-flex"></div>
																						<div class="rex-live__row-column-wrap bl_d-flex bl_jc-c bl_ai-c modal-form-column-wrapper">
																								<div class="modal-form-column">
																										<div class="bl_d-flex bl_jc-c">
																												<div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Top', 'rexpansive-builder' ); ?>">
																														<input type="text" id="rex-wpcf7-columns-padding-top" class="columns-padding-values" name="rex-wpcf7-columns-padding-top" placeholder="0"/>
																														<span class="bl_input-indicator">px</span>
																												</div> <!-- // Columns padding top -->
																										</div>
																										<div class="bl_d-flex bl_ai-c bl_jc-sb">
																												<div>
																														<div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Left', 'rexpansive-builder' ); ?>">
																																<input type="text" id="rex-wpcf7-columns-padding-left" class="columns-padding-values" name="rex-wpcf7-columns-padding-left" placeholder="0"/>
																																<span class="bl_input-indicator">px</span>
																														</div> <!-- // Columns padding left -->
																												</div>
																												<div class="modal-form-column-title">column</div>
																												<div>
																														<div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Right', 'rexpansive-builder' ); ?>">
																																<input type="text" id="rex-wpcf7-columns-padding-right" class="columns-padding-values" name="rex-wpcf7-columns-padding-right" placeholder="0"/>
																																<span class="bl_input-indicator">px</span>
																														</div> <!-- // Columns padding right -->
																												</div>
																										</div>
																										<div class="bl_d-flex bl_jc-c">
																												<div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Padding Bottom', 'rexpansive-builder' ); ?>">
																														<input type="text" id="rex-wpcf7-columns-padding-bottom" class="columns-padding-values" name="rex-wpcf7-columns-padding-bottom" placeholder="0"/>
																														<span class="bl_input-indicator">px</span>
																												</div> <!-- // Columns padding bottom -->
																										</div>
																								</div>
																						</div>
																						<div class="modal-form-column-wrapper lateral bl_d-flex"></div>
																				</div>
																				<div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Right', 'rexpansive-builder' ); ?>">
																						<input type="text" id="rex-wpcf7-margin-right" class="form-margin-values" name="rex-wpcf7-margin-right" placeholder="0"/>
																						<span class="bl_input-indicator">px</span>
																				</div> <!-- // Form margin right -->
																		</div>
																		<div class="bl_d-flex bl_jc-c riga-3">
																				<div class="val-wrap bl_d-iflex bl_ai-c tippy" data-tippy-content="<?php _e( 'Margin Bottom', 'rexpansive-builder' ); ?>">
																						<input type="text" id="rex-wpcf7-margin-bottom" class="form-margin-values" name="rex-wpcf7-margin-bottom" placeholder="0"/>
																						<span class="bl_input-indicator">px</span>
																				</div> <!-- // Form margin bottom -->
																		</div>
																</div>
														</div>
												</div>
												<div class="bl_modal-row rex-wpcf7-modal-row-tall modal-row-grey"> <!-- // Form Background Color, Form Border Color -->
														<div class="bl_modal__option-wrap w190 bl_jc-c">
																<div id="" class="bl_modal__single-option valign-wrapper tippy" data-tippy-content="<?php _e('Background Color', 'rexpansive-builder');?>">
																		<div class="bl_d-iblock form-icon l-icon--dark-grey">
																				<?php Rexbuilder_Utilities::get_icon('#B021-Form-Background'); ?>
																		</div>
																		<div class="bl_d-iblock ml19"  >
																				<input type="hidden" id="rex-wpcf7-background-color-runtime" name="rex-wpcf7-background-color-runtime" value="" />
																				<input id="rex-wpcf7-background-color" type="text" name="rex-wpcf7-background-color" value="" size="10" />
																				<div id="rex-wpcf7-background-color-preview-icon" class="rex-wpcf7-background-color-preview-icon"></div>
																		</div>
																</div>
														</div>
														<div class="bl_modal__option-wrap w190 pr4 pl20 valign-wrapper">
																<div id="" class="bl_modal__single-option valign-wrapper">
																		<span class="valign-wrapper tippy" data-tippy-content="<?php _e('Border Color', 'rexpansive-builder');?>">
																				<div class="bl_d-iblock form-icon pl3 l-icon--dark-grey">
																						<?php Rexbuilder_Utilities::get_icon('#B022-Form-Border'); ?>
																				</div>
																				<div class="bl_d-iblock ml19"  >
																						<input type="hidden" id="rex-wpcf7-border-color-runtime" name="rex-wpcf7-border-color-runtime" value="" />
																						<input id="rex-wpcf7-border-color" type="text" name="rex-wpcf7-border-color" value="" size="10" />
																						<div id="rex-wpcf7-border-color-preview-icon" class="rex-wpcf7-border-color-preview-icon"></div>
																				</div>
																		</span>
																		<span class="valign-wrapper ml19 tippy" data-tippy-content="<?php _e('Border Width', 'rexpansive-builder');?>">
																				<div class="bl_d-iblock with-text"> 
																						<input type="text" id="rex-wpcf7-set-border-width" name="rex-wpcf7-set-border-width" class="">
																				</div>
																				<div class="bl_d-iblock ml3">
																						<div class="label-px">px</div>
																				</div>
																		</span>
																</div>
														</div>
												</div>
												<div class="bl_modal-row rex-wpcf7-modal-row-tall modal-row-grey"> <!-- // Warning Message -->
														<div class="rexwpcf7-cont_row valign-wrapper">
																<div class="bl_d-iblock input-field with-text-left pl4 rex-wpcf7-modal-column-w253 rex-input-prefixed">
																		<span class="prefix">
																				<?php Rexbuilder_Utilities::get_icon('#B019-Error'); ?>
																		</span>
																		<input type="text" id="rex-wpcf7-error-message" name="" class="rex-wpcf7-error-message">
																		<label for="rex-wpcf7-error-message">
																				<?php _e('Warning Message', 'rexpansive-builder');?>
																		</label>
																</div>
																<div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Warning Message Color', 'rexpansive-builder');?>">
																		<input type="hidden" id="rex-wpcf7-error-message-color-runtime" name="rex-wpcf7-error-message-color-runtime" value="" />
																		<input id="rex-wpcf7-error-message-color" type="text" name="rex-wpcf7-error-message-color" value="" size="10" />
																		<div id="rex-wpcf7-error-message-color-preview-icon" class="rex-wpcf7-error-message-color-preview-icon"></div>
																</div>
																<div class="bl_d-iblock with-text ml19 tippy" data-tippy-content="<?php _e('Warning Message Font Size', 'rexpansive-builder');?>">
																		<input type="text" id="rex-wpcf7-set-error-message-font-size" name="" class="rex-wpcf7-set-error-message-font-size bl_d-iblock">
																</div>
																<div class="bl_d-iblock ml3">
																		<div class="label-px">px</div>
																</div>
														</div>
												</div>
												<div class="bl_modal-row rex-wpcf7-modal-row-tall modal-row-grey"> <!-- // Send Message -->
														<div class="rexwpcf7-cont_row valign-wrapper">
																<div class="bl_d-iblock input-field with-text-left rex-wpcf7-modal-column-w253 pl4 rex-input-prefixed ">
																		<span class="prefix">
																				<?php Rexbuilder_Utilities::get_icon('#B020-Checked'); ?>
																		</span>
																		<input type="text" id="rex-wpcf7-send-message" name="" class="rex-wpcf7-send-message">
																		<label for="rex-wpcf7-send-message">
																				<?php _e('Success Message', 'rexpansive-builder');?>
																		</label>
																</div>
																<div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Success Message Color', 'rexpansive-builder');?>">
																		<input type="hidden" id="rex-wpcf7-send-message-color-runtime" name="rex-wpcf7-send-message-color-runtime" value="" />
																		<input id="rex-wpcf7-send-message-color" type="text" name="rex-wpcf7-send-message-color" value="" size="10" />
																		<div id="rex-wpcf7-send-message-color-preview-icon" class="rex-wpcf7-send-message-color-preview-icon"></div>
																</div>
																<div class="bl_d-iblock with-text ml19 tippy" data-tippy-content="<?php _e('Success Message Font Size', 'rexpansive-builder');?>">
																		<input type="text" id="rex-wpcf7-set-send-message-font-size" name="" class="rex-wpcf7-set-send-message-font-size bl_d-iblock">
																</div>
																<div class="bl_d-iblock ml3">
																		<div class="label-px">px</div>
																</div>
														</div>
												</div>
										</div>
								</div>
						</div>
						<div class="rexpansive-accordion-outer close"> <!-- // Inputs Accordion -->
								<div id="rex-wpcf7-inputs-accordion" class="bl_modal-row rex-accordion-outer--toggle">
										<div class="rexwpcf7-cont_row bl_ai-c bl_jc-c valign-wrapper">
												<div class="rex-wpcf7-accordion-outer-plus-wrap bl_d-iblock">
														<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
												</div>
												<div class="rex-wpcf7-title-icon l-icon--dark-grey bl_d-iblock">
														<?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
												</div>
												<div class="bl_d-iblock modal-accordion-title">inputs</div>
										</div>
								</div>
								<div class="rex-accordion-outer--content" style="display:none;" data-item-status="close">
										<div class="bl-modal-row"> <!-- // Inputs Settings -->
												<div class="bl_modal-row bl_jc-c modal-row-grey rex-wpcf7-modal-row-tall"> <!-- // Content Preview -->
														<div class="bl_d-iblock with-preview-text tippy" data-tippy-content="<?php _e('Preview', 'rexpansive-builder');?>">
																<input type="text" value="Your text" class="rex-wpcf7-text-modal-preview" readonly>
														</div>
												</div>
												<div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall"> <!-- // Columns Width, Columns Height -->
														<div class="bl_modal__option-wrap bl_jc-c tippy" data-tippy-content="<?php _e('Width', 'rexpansive-builder');?>">
																<div class="rex-input-prefixed input-field w67 with-text">
																		<span class="prefix">
																				<?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?>
																		</span>
																		<input type="text" id="rex-wpcf7-content-width" class="rex-wpcf7-content-width" name="">
																		<span class="rex-material-bar"></span>
																</div>
																<div class="ml12">
																		<div class="rex-check-text percentage-width boxed-width-type-wrap">
																				<input id="rex-wpcf7-content-width-percentage" type="radio" class="rex-wpcf7-content-width-type with-gap" name="rex-wpcf7-content-width-type" value="percentage" checked />
																				<label for="rex-wpcf7-content-width-percentage">
																						<?php _e('%', 'rexpansive-builder');?>
																						<span class="rex-ripple"></span>
																				</label>
																		</div>
																		<div class="rex-check-text pixel-width boxed-width-type-wrap">
																				<input id="rex-wpcf7-content-width-pixel" type="radio" class="rex-wpcf7-content-width-type with-gap" name="rex-wpcf7-content-width-type" value="pixel" />
																				<label for="rex-wpcf7-content-width-pixel">
																						<?php _e('PX', 'rexpansive-builder');?>
																						<span class="rex-ripple"></span>
																				</label>
																		</div>
																</div>
														</div>
														<div class="bl_modal__option-wrap bl_jc-c tippy" data-tippy-content="<?php _e('Height', 'rexpansive-builder');?>">
																<div class="rex-input-prefixed input-field w67 with-text">
																		<span class="prefix">
																				<?php Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?>  
																		</span>
																		<input type="text" id="rex-wpcf7-content-height" class="rex-wpcf7-content-height" name="" size="23">
																		<span class="rex-material-bar"></span>
																</div>
																<div class="bl_d-iblock label-px ml12" style="font-size: 16px;">
																	<?php _e('PX', 'rexpansive-builder');?>
																</div>
														</div>
												</div>
												<div class="rex-accordion close"> <!-- // Content Text -->
														<div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
																<div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
																		<div class="bl_d-iblock rex-wpcf7-accordion-plus-wrap">
																				<span class="rex-accordion--toggle">
																						<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
																				</span>
																		</div>
																		<div class="bl_d-iblock big-icon ml12 l-icon--dark-grey">
																				<?php Rexbuilder_Utilities::get_icon('#B023-Input-Text'); ?>
																		</div>
																		<div class="bl_d-iblock posrel ml19 tippy"  data-tippy-content="<?php _e('Text Color', 'rexpansive-builder');?>">
																				<input type="hidden" id="rex-wpcf7-content-text-color-runtime" name="rex-wpcf7-content-text-color-runtime" value="" />
																				<input id="rex-wpcf7-content-text-color" type="text" name="rex-wpcf7-content-text-color" value="" size="10" />
																				<div id="rex-wpcf7-content-text-color-preview-icon" class="preview-color-icon"></div>
																		</div>
																		<div id="text-color-palette" class="ml12 clearfix">
																				<div class="bg-palette-selector">
																						<input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
																						<span class="bg-palette-button bg-palette-blue"></span>
																				</div>
																				<div class="bg-palette-selector">
																						<input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
																						<span class="bg-palette-button bg-palette-green"></span>
																				</div>
																				<div class="bg-palette-selector">
																						<input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
																						<span class="bg-palette-button bg-palette-black"></span>
																				</div>
																				<div class="bg-palette-selector">
																						<input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
																						<span class="bg-palette-button bg-palette-red"></span>
																				</div>
																				<div class="bg-palette-selector">
																						<input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
																						<span class="bg-palette-button bg-palette-transparent">
																								<i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
																						</span>
																				</div>
																		</div>
																		<div class="bl_d-iblock with-text ml24 tippy" data-tippy-content="<?php _e('Font Size', 'rexpansive-builder');?>">
																				<input type="text" id="rex-wpcf7-set-content-font-size" name="" class="bl_d-iblock rex-wpcf7-set-content-font-size">
																				<div class="bl_d-iblock label-px">px</div>
																		</div>
																</div>
														</div>
														<div class="rex-accordion--content" style="display:none;" data-item-status="close"> <!-- // Content Text Color Hover -->
																<div class="bl_modal-row rex-wpcf7-modal-row-tall">
																		<div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
																				<div class="bl_d-iblock ml36 big-icon l-icon--dark-grey">
																						<?php Rexbuilder_Utilities::get_icon('#B024-Input-Text-Hover'); ?>
																				</div>
																				<div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Hover Text Color', 'rexpansive-builder');?>">
																						<input type="hidden" id="rex-wpcf7-content-text-color-hover-runtime" name="rex-wpcf7-content-text-color-hover-runtime" value="" />
																						<input id="rex-wpcf7-content-text-color-hover" type="text" name="rex-wpcf7-content-text-color-hover" value="" size="10" />
																						<div id="rex-wpcf7-content-text-color-hover-preview-icon" class="preview-color-icon"></div>
																				</div>
																				<div id="hover-text-color-palette" class="ml12 clearfix">
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
																								<span class="bg-palette-button bg-palette-blue"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
																								<span class="bg-palette-button bg-palette-green"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
																								<span class="bg-palette-button bg-palette-black"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
																								<span class="bg-palette-button bg-palette-red"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
																								<span class="bg-palette-button bg-palette-transparent">
																										<i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
																								</span>
																						</div>
																				</div>
																		</div>
																</div>
														</div>
												</div>
												<div class="rex-accordion close"> <!-- // Content Background Color -->
														<div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
																<div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
																		<div class="bl_d-iblock rex-wpcf7-accordion-plus-wrap">
																				<span class="rex-accordion--toggle">
																						<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
																				</span>
																		</div>
																		<div class="bl_d-iblock ml12 big-icon l-icon--dark-grey">
																				<?php Rexbuilder_Utilities::get_icon('#B025-Input-Background'); ?>
																		</div>
																		<div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Background Color', 'rexpansive-builder');?>">
																				<input type="hidden" id="rex-wpcf7-content-background-color-runtime" name="rex-wpcf7-content-background-color-runtime" value="" />
																				<input id="rex-wpcf7-content-background-color" type="text" name="rex-wpcf7-content-background-color" value="" size="10" />
																				<div id="rex-wpcf7-content-background-color-preview-icon" class="preview-color-icon"></div>
																		</div>
																		<div id="background-color-palette" class="ml12 clearfix">
																				<div class="bg-palette-selector">
																						<input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
																						<span class="bg-palette-button bg-palette-blue"></span>
																				</div>
																				<div class="bg-palette-selector">
																						<input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
																						<span class="bg-palette-button bg-palette-green"></span>
																				</div>
																				<div class="bg-palette-selector">
																						<input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
																						<span class="bg-palette-button bg-palette-black"></span>
																				</div>
																				<div class="bg-palette-selector">
																						<input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
																						<span class="bg-palette-button bg-palette-red"></span>
																				</div>
																				<div class="bg-palette-selector">
																						<input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
																						<span class="bg-palette-button bg-palette-transparent">
																								<i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
																						</span>
																				</div>
																		</div>
																</div>
														</div>
														<div class="rex-accordion--content" style="display:none;" data-item-status="close"> <!-- // Content Background Color Hover -->
																<div class="bl_modal-row rex-wpcf7-modal-row-tall">
																		<div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
																				<div class="bl_d-iblock ml36 big-icon l-icon--dark-grey">
																						<?php Rexbuilder_Utilities::get_icon('#B026-Input-Background-Hover'); ?>
																				</div>
																				<div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Hover Background Color', 'rexpansive-builder');?>">
																						<input type="hidden" id="rex-wpcf7-content-background-color-hover-runtime" name="rex-wpcf7-content-background-color-hover-runtime" value="" />
																						<input id="rex-wpcf7-content-background-color-hover" type="text" name="rex-wpcf7-content-background-color-hover" value="" size="10" />
																						<div id="rex-wpcf7-content-background-color-hover-preview-icon" class="preview-color-hover-icon"></div>
																				</div>
																				<div id="hover-background-color-palette" class="ml12 clearfix">
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
																								<span class="bg-palette-button bg-palette-blue"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
																								<span class="bg-palette-button bg-palette-green"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
																								<span class="bg-palette-button bg-palette-black"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
																								<span class="bg-palette-button bg-palette-red"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
																								<span class="bg-palette-button bg-palette-transparent">
																										<i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
																								</span>
																						</div>
																				</div>
																		</div>
																</div>
														</div>
												</div>
												<div class="rex-accordion close"> <!-- // Content Border -->
														<div class="bl_modal-row modal-row-grey rex-wpcf7-modal-row-tall">
																<div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
																		<div class="bl_d-iblock rex-wpcf7-accordion-plus-wrap">
																				<span class="rex-accordion--toggle">
																						<?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
																				</span>
																		</div>
																		<div class="bl_d-iblock ml12 big-icon l-icon--dark-grey">
																				<?php Rexbuilder_Utilities::get_icon('#B027-Input-Border'); ?>
																		</div>
																		<div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Border Color', 'rexpansive-builder');?>">
																				<input type="hidden" id="rex-wpcf7-content-border-color-runtime" name="rex-wpcf7-content-border-color-runtime" value="" />
																				<input id="rex-wpcf7-content-border-color" type="text" name="rex-wpcf7-content-border-color" value="" size="10" />
																				<div id="rex-wpcf7-content-border-color-preview-icon" class="preview-color-icon"></div>
																		</div>
																		<div class="bl_d-iblock w115 ml54 with-text tippy" data-tippy-content="<?php _e('Border Width', 'rexpansive-builder');?>">
																				<span class="bl_d-iblock l-icon--dark-grey l-icon--rotate-90"><?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?></span>
																				<input type="text" id="rex-wpcf7-set-content-border-width" name="" class="rex-wpcf7-set-content-border-width bl_d-iblock ml12">
																				<div class="label-px bl_d-iblock">px</div>
																		</div>
																		<div class="bl_d-iblock ml2 with-text tippy" data-tippy-content="<?php _e('Border Radius', 'rexpansive-builder');?>">
																				<span class="bl_d-iblock l-icon--dark-grey"><?php Rexbuilder_Utilities::get_icon('#D001-Radius'); ?></span>
																				<input type="text" id="rex-wpcf7-set-content-border-radius" name="" class="rex-wpcf7-set-content-border-radius bl_d-iblock ml12">
																				<div class="label-px bl_d-iblock">px</div>
																		</div>
																</div>
														</div>
														<div class="rex-accordion--content" style="display:none;" data-item-status="close"> <!-- // Content Border Color Hover -->
																<div class="bl_modal-row rex-wpcf7-modal-row-tall">
																		<div class="rexwpcf7-cont_row bl_ai-c valign-wrapper">
																				<div class="bl_d-iblock ml36 big-icon l-icon--dark-grey">
																						<?php Rexbuilder_Utilities::get_icon('#B028-Input-Border-Hover'); ?>
																				</div>
																				<div class="bl_d-iblock ml19 tippy"  data-tippy-content="<?php _e('Hover Border Color', 'rexpansive-builder');?>">
																						<input type="hidden" id="rex-wpcf7-content-border-color-hover-runtime" name="rex-wpcf7-content-border-color-hover-runtime" value="" />
																						<input id="rex-wpcf7-content-border-color-hover" type="text" name="rex-wpcf7-content-border-color-hover" value="" size="10" />
																						<div id="rex-wpcf7-content-border-color-hover-preview-icon" class="preview-color-icon"></div>
																				</div>
																				<div id="hover-border-color-palette" class="ml12 clearfix">
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(33,150,243,1)">
																								<span class="bg-palette-button bg-palette-blue"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(139,195,74,1)">
																								<span class="bg-palette-button bg-palette-green"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(0,0,0,1)">
																								<span class="bg-palette-button bg-palette-black"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(244,67,54,1)">
																								<span class="bg-palette-button bg-palette-red"></span>
																						</div>
																						<div class="bg-palette-selector">
																								<input class="bg-palette-value" type="hidden" value="rgba(255,255,255,0)">
																								<span class="bg-palette-button bg-palette-transparent">
																										<i class="l-svg-icons"><svg><use xlink:href="#C002-No-Select"></use></svg></i>
																								</span>
																						</div>
																				</div>
																		</div>
																</div>
														</div>
												</div>
										</div>
								</div>
						</div>
				</div>
				<!-- // Footer -->
				<div class="rex-modal__outside-footer">
						<div class="tool-button tool-button--inline tool-button--confirm tool-button--modal rex-apply-button tippy" data-tippy-content="<?php _e('Save','rexpansive-builder'); ?>" data-rex-option="save">
								<span class="rex-button save-page btn-save--wrap">
									<?php Rexbuilder_Utilities::get_icon('#Z016-Checked'); ?>
								</span>
						</div>
						<div class="tool-button tool-button--centered rex-reset-button tippy" data-rex-option="continue" data-tippy-content="<?php _e('Reset','rexpansive-builder'); ?>">
								<?php Rexbuilder_Utilities::get_icon('#Z014-Refresh'); ?>
						</div>
				</div>
	</div>
</div>
<!-- Wpcf7 Form Editor -->