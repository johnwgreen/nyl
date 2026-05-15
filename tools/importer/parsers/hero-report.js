/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-report.
 * Base block: hero
 * Source: https://www.newyorklife.com/report-to-policy-owners
 * Generated: 2026-05-15
 *
 * Extracts hero content including pretitle, heading, description paragraphs,
 * CTA link, and hero image from the source .hero container.
 *
 * Live DOM uses cmp-hero__* classes (e.g. cmp-hero__image, cmp-hero__content,
 * cmp-hero__description, cmp-hero__cta). Fallbacks handle cached source.html
 * structure (.hero-image, .hero-content, .hero-description, .hero-cta).
 */
export default function parse(element, { document }) {
  // Extract hero image - live uses .cmp-hero__image, cached uses .hero-image
  const heroImage = element.querySelector('.cmp-hero__image img, .hero-image img, img');

  // Extract heading (h1 element - contains pretitle span and heading text)
  const heading = element.querySelector('h1, h2');

  // Extract description paragraphs
  // Live uses .cmp-hero__description, cached uses .hero-description
  const descriptionContainer = element.querySelector('.cmp-hero__description, .hero-description');
  const descriptions = descriptionContainer
    ? Array.from(descriptionContainer.querySelectorAll('p'))
    : Array.from(element.querySelectorAll('.cmp-hero__content p, .hero-content p'));

  // Filter out empty paragraphs (spacer paragraphs with only &nbsp;)
  const validDescriptions = descriptions.filter((p) => {
    const text = p.textContent.trim();
    return text.length > 0 && text !== ' ';
  });

  // Extract CTA link
  // Live uses .cmp-hero__cta .button a, cached uses .hero-cta a
  const ctaLink = element.querySelector('.cmp-hero__cta a, .hero-cta a');

  // Build cells matching block library structure:
  // Row 1: Image
  // Row 2: Heading (includes pretitle as part of h1)
  // Row 3: Description text
  // Row 4: CTA link
  const cells = [];

  // Row 1: Hero image
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 2: Heading (h1 includes pretitle span + heading text)
  if (heading) {
    cells.push([heading]);
  }

  // Row 3: Description paragraphs
  if (validDescriptions.length > 0) {
    cells.push([...validDescriptions]);
  }

  // Row 4: CTA link
  if (ctaLink) {
    cells.push([ctaLink]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-report', cells });
  element.replaceWith(block);
}
