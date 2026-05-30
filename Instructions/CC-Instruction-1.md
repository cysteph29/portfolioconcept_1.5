On the case study pages, the navigation has an unwanted entrance on page load: it starts above the top of the viewport and slides down into place. Remove that on-load behavior. The rest of the page content fading in and sliding up slightly is fine and should stay as is.

Root cause (already identified): the nav has a scroll-driven show/hide behavior. Scrolling down hides it (moves it up out of view), scrolling back up slides it down from above. That same "slide down from above" entrance is incorrectly playing on initial mount / page load, instead of only as a response to scrolling up.

Desired behavior:
- On page load (case study pages, and any page load), the nav must appear in its final resting position immediately, with NO entrance animation at all. No vertical slide and no fade. It should behave exactly like the homepage nav, which has no mount animation and is simply always present.
- The slide-down-from-above transition should only happen as a response to a scroll-up gesture AFTER the user has actually scrolled.
- Keep the existing scroll behavior fully intact: scrolling down still hides the nav, scrolling back up still slides it down from the top.

Implementation guidance:
- Find the nav component's scroll-driven show/hide logic and make its initial mount state the visible/resting state (vertical offset at 0), so no entrance transition runs on first render. In Framer Motion terms, set initial to the resting state (or initial={false}) while leaving the scroll-driven state changes intact for real scrolling.
- While you are in there, check where the nav is mounted. If it re-mounts per page, consider whether it should live in the persistent layout (outside the per-page route transition) so it does not re-mount or re-animate on navigation. Flag this to me if it requires a structural change rather than making that change unprompted.
- Confirm the slide is coming from this scroll-nav behavior and not from the case study page entry transition, and fix it at the actual source.

Do not change the content fade/slide-up entrance, and do not break the scroll hide/show behavior. When done, tell me which files you changed and confirm: on a fresh case study load the nav is simply present with no animation, scrolling down still hides it, and scrolling back up still slides it down.
