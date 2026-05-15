/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: New York Life sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Selectors validated against live DOM at https://www.newyorklife.com/report-to-policy-owners:
 *   - .hero (section 1, Hero)
 *   - .cmp-teaser__dark-blue (section 2, Quote - style: dark-blue)
 *   - .cmp-container-top--none.cmp-container-bottom--none (section 3, Letter)
 *   - .cmp-container-top--medium.cmp-container-bottom--large (section 4, CTA - style: grey)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid position shifts when inserting elements
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section) => {
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) return;

      // Insert Section Metadata block after the section content when style is defined
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(metadataBlock);
      }

      // Insert <hr> before every section except the first to mark section boundaries
      if (section.id !== 'section-1') {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
