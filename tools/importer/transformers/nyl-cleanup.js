/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: New York Life cleanup.
 * Removes non-authorable site chrome and widgets.
 * Selectors validated against live DOM at https://www.newyorklife.com/report-to-policy-owners
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // OneTrust cookie consent banner (confirmed: #onetrust-consent-sdk on live page)
    // Qualtrics survey widget (confirmed: #ZN_1I9FlYp5OesG2jz on live page)
    // OneTrust injected style tag (confirmed: #onetrust-style on live page)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-style',
      '#ZN_1I9FlYp5OesG2jz',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header with navigation (confirmed: <header class="experiencefragment ..."> on live page)
    // Footer (confirmed: <footer class="experiencefragment ..."> on live page)
    // Navigation (confirmed: <nav class="cmp-header__main-navigation"> inside header)
    // Analytics tracking div (confirmed: #page-analytics on live page)
    // Scripts, noscript, iframes, link tags (confirmed: 28 scripts, 1 noscript, 1 iframe on live page)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '#page-analytics',
      'script',
      'noscript',
      'iframe',
      'link',
    ]);
  }
}
