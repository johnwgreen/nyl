/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-author
 * Base block: columns
 * Source: https://www.newyorklife.com/report-to-policy-owners
 * Selector: #container-2ed95f14e5
 * Generated: 2026-05-15
 *
 * Converts author info (portrait image + name/title) into a Columns block
 * with two columns: image in column 1, heading + subtitle in column 2.
 *
 * Live DOM structure:
 *   #container-2ed95f14e5 (.cmp-container)
 *     div.aem-Grid
 *       div.image > div.cmp-image > picture > img[alt="Craig DeSanto"]
 *       div.text > div.cmp-text > h2 + p
 */
export default function parse(element, { document }) {
  // Extract author portrait image
  // Live page: .cmp-image > picture > img
  // Fallback: any img in the container
  const image = element.querySelector('.cmp-image img') || element.querySelector('img');

  // Extract author name heading
  // Live page: .cmp-text > h2 (contains span with name)
  const heading = element.querySelector('.cmp-text h2') || element.querySelector('h2');

  // Extract author title/subtitle paragraph
  // Live page: .cmp-text > p (contains span.body-base > span.text__dark-gray)
  const subtitle = element.querySelector('.cmp-text p') || element.querySelector('p');

  // Build cells to match Columns block library structure:
  // One row with two columns: [image] | [name + title]
  const cells = [];

  const col1 = [];
  if (image) col1.push(image);

  const col2 = [];
  if (heading) col2.push(heading);
  if (subtitle) col2.push(subtitle);

  cells.push([col1, col2]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-author', cells });
  element.replaceWith(block);
}
