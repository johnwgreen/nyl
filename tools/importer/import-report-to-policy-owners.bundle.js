/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-report-to-policy-owners.js
  var import_report_to_policy_owners_exports = {};
  __export(import_report_to_policy_owners_exports, {
    default: () => import_report_to_policy_owners_default
  });

  // tools/importer/parsers/hero-report.js
  function parse(element, { document }) {
    const heroImage = element.querySelector(".cmp-hero__image img, .hero-image img, img");
    const heading = element.querySelector("h1, h2");
    const descriptionContainer = element.querySelector(".cmp-hero__description, .hero-description");
    const descriptions = descriptionContainer ? Array.from(descriptionContainer.querySelectorAll("p")) : Array.from(element.querySelectorAll(".cmp-hero__content p, .hero-content p"));
    const validDescriptions = descriptions.filter((p) => {
      const text = p.textContent.trim();
      return text.length > 0 && text !== "\xA0";
    });
    const ctaLink = element.querySelector(".cmp-hero__cta a, .hero-cta a");
    const cells = [];
    if (heroImage) {
      cells.push([heroImage]);
    }
    if (heading) {
      cells.push([heading]);
    }
    if (validDescriptions.length > 0) {
      cells.push([...validDescriptions]);
    }
    if (ctaLink) {
      cells.push([ctaLink]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-report", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-author.js
  function parse2(element, { document }) {
    const image = element.querySelector(".cmp-image img") || element.querySelector("img");
    const heading = element.querySelector(".cmp-text h2") || element.querySelector("h2");
    const subtitle = element.querySelector(".cmp-text p") || element.querySelector("p");
    const cells = [];
    const col1 = [];
    if (image) col1.push(image);
    const col2 = [];
    if (heading) col2.push(heading);
    if (subtitle) col2.push(subtitle);
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-author", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/nyl-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-style",
        "#ZN_1I9FlYp5OesG2jz"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        "#page-analytics",
        "script",
        "noscript",
        "iframe",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/nyl-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) return;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metadataBlock);
        }
        if (section.id !== "section-1") {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-report-to-policy-owners.js
  var parsers = {
    "hero-report": parse,
    "columns-author": parse2
  };
  var PAGE_TEMPLATE = {
    name: "report-to-policy-owners",
    description: "Report to Policy Owners informational page",
    urls: [
      "https://www.newyorklife.com/report-to-policy-owners"
    ],
    blocks: [
      {
        name: "hero-report",
        instances: [".hero"]
      },
      {
        name: "columns-author",
        instances: ["#container-2ed95f14e5"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: ".hero",
        style: null,
        blocks: ["hero-report"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Quote",
        selector: ".cmp-teaser__dark-blue",
        style: "dark-blue",
        blocks: [],
        defaultContent: [".cmp-teaser__title"]
      },
      {
        id: "section-3",
        name: "Letter",
        selector: ".cmp-container-top--none.cmp-container-bottom--none",
        style: null,
        blocks: ["columns-author"],
        defaultContent: [".letter-content h4", ".letter-content p"]
      },
      {
        id: "section-4",
        name: "CTA",
        selector: ".cmp-container-top--medium.cmp-container-bottom--large",
        style: "grey",
        blocks: [],
        defaultContent: [".cta-section h2", ".cta-section a"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_report_to_policy_owners_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_report_to_policy_owners_exports);
})();
