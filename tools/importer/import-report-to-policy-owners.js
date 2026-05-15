/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroReportParser from './parsers/hero-report.js';
import columnsAuthorParser from './parsers/columns-author.js';

// TRANSFORMER IMPORTS
import nylCleanupTransformer from './transformers/nyl-cleanup.js';
import nylSectionsTransformer from './transformers/nyl-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-report': heroReportParser,
  'columns-author': columnsAuthorParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'report-to-policy-owners',
  description: 'Report to Policy Owners informational page',
  urls: [
    'https://www.newyorklife.com/report-to-policy-owners',
  ],
  blocks: [
    {
      name: 'hero-report',
      instances: ['.hero'],
    },
    {
      name: 'columns-author',
      instances: ['#container-2ed95f14e5'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.hero',
      style: null,
      blocks: ['hero-report'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Quote',
      selector: '.cmp-teaser__dark-blue',
      style: 'dark-blue',
      blocks: [],
      defaultContent: ['.cmp-teaser__title'],
    },
    {
      id: 'section-3',
      name: 'Letter',
      selector: '.cmp-container-top--none.cmp-container-bottom--none',
      style: null,
      blocks: ['columns-author'],
      defaultContent: ['.letter-content h4', '.letter-content p'],
    },
    {
      id: 'section-4',
      name: 'CTA',
      selector: '.cmp-container-top--medium.cmp-container-bottom--large',
      style: 'grey',
      blocks: [],
      defaultContent: ['.cta-section h2', '.cta-section a'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  nylCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [nylSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((el) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element: el,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
