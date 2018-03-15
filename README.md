# edge-scroll
Configurable edge scrolling for web pages.

Scrolls the page when the cursor goes near the edges of the window.

How to use
----------
### Include in script tag
Include `edge-scroll.js` or `edge-scroll.min.js` on your web page in a `<script>` tag, then in
your main JavaScript file, call `EdgeScroll` passing the radius from the edges to start scrolling
at and the maximum scrolling speed (in pixels per second).

```javascript
var edgeScroll = new EdgeScroll(100, 800);
```

### Include self executing script tag
Include `edge-scroll-auto.js` or `edge-scroll-auto.min.js` in a script tag on your web page
to use default values of 100 pixel radius and 750 pixel per second speed.

No further steps are necessary.

### Include as part of a module loader

Install:
```
npm install edge-scroll
```

In main JS file:
```
import EdgeScroll from 'edge-scroll'

const edgeScroll = new EdgeScroll(120, 750)
```

Scroll Events
-------------
The EdgeScroll object has some methods you may find useful

- `onScroll(Function handler)` adds an event listener to listen for scroll events
- `offScroll(Function handler)` removes a previously added event listener

The handlers are called with the following arguments:
- Number scrollX : the X scroll position of the window
- Number scrollY : the Y scroll position of the window
- Number innerWidth : the width of the window
- Number innerHeight : the height of the window

```javascript
var edgeScroll = new EdgeScroll(80, 750);

edgeScroll.onScroll(function (scrollX, scrollY, innerWidth, innerHeight) {
	console.log(scrollX);
	console.log(scrollY);
	console.log(innerWidth);
	console.log(innerHeight);
});
```

The reason to use EdgeScroll handlers rather than just using `addEventListener('scroll')` is
to prevent layout thrashing: all those properties are cached on the EdgeScroll object once per
animation frame so the browser doesn't have to do a reflow to access them.

You can access them at any time, but the handlers give them to you every time the page scrolls.
```
var edgeScroll = new EdgeScroll(100, 750);

console.log(edgeScroll.scrollX);
console.log(edgeScroll.scrollY);
console.log(edgeScroll.innerWidth);
console.log(edgeScroll.innerHeight);
```

Dead Zones
----------
You can specify deadzones where scrolling should not occur. If you have something in the corner
that you'd like to be clickable, without causing the window to scroll while hovering over it
for example.

- `addDeadzone(Element elem)` Adds mouseenter and mouseleave event listeners to prevent scrolling
on the supplied HTML element.
- `removeDeadzone(Element elem)` Removes a previously added deadzone

```javascript
var edgeScroll = new EdgeScroll(100, 750);

edgeScroll.addDeadZone(document.getElementById('corner-widget'))
```

Edge Scrolling Everywhere
-------------------------
For extra fun, try injecting edge-scroll-auto into every web page you visit with a browser
extension.

I swear you'll wonder why it's not on every web page on the internet by default.
