(function (radius, speed) {
	this.radius = radius //distance from the edge to start scrolling
	this.speed = speed // pixels per second
	this.scrolling = false
	this.proximity = null
	this.clientX = null
	this.clientY = null
	this.scrollX = window.scrollX
	this.scrollY = window.scrollY
	this.innerWidth = window.innerWidth
	this.innerHeight = window.innerHeight
	this.handlers = []
	this.deadzones = []
	
	this.clampedVelocity = function () {
		var N = 6
		var p = this.proximity / this.radius
		return Math.pow(p * -1/2 + 1, N)
	}

	this.scrollTick = (function (time) {
		var elapsed = this.lastTime ? time - this.lastTime : 0
		this.lastTime = time
		
		if (this.scrolling === false) {
			return this.lastTime = 0
		}

		var centerX = this.innerWidth / 2
		var centerY = this.innerHeight / 2

		var headingX = this.clientX - centerX
		var headingY = this.clientY - centerY

		var magnitude = Math.sqrt(Math.pow(headingX, 2) + Math.pow(headingY, 2))
		var normalizedX = headingX / magnitude
		var normalizedY = headingY / magnitude

		var velocityX = normalizedX * this.speed * this.clampedVelocity()
		var velocityY = normalizedY * this.speed * this.clampedVelocity()
		window.scrollBy(Math.round(velocityX * elapsed / 1000), Math.round(velocityY * elapsed / 1000))
		this.scrollX = window.scrollX
		this.scrollY = window.scrollY
		this.innerWidth = window.innerWidth
		this.innerHeight = window.innerHeight

		window.requestAnimationFrame(this.scrollTick)
	}).bind(this)

	this.scroll = function (x, y) {
		window.scroll(x, y)
		this.scrollX = window.scrollX
		this.scrollY = window.scrollY
		this.innerWidth = window.innerWidth
		this.innerHeight = window.innerHeight
	}

	this.onScroll = function (handler) {
		this.handlers.push(handler)
	}

	this.offScroll = function (handler) {
		var i = this.handlers.indexOf(handler)
		if (i > -1) {
			this.handlers.splice(i, 1)
		}
	}

	var scroll = this

	document.addEventListener('mouseout', function (evt) {
		if (evt.relatedTarget === null) {
			scroll.scrolling = false
		}
	})

	document.addEventListener('mousemove', function (evt) {
		scroll.clientX = evt.clientX
		scroll.clientY = evt.clientY
		var px1 = evt.clientX - 0
		var px2 = scroll.innerWidth - evt.clientX
		var px3 = evt.clientY - 0
		var px4 = scroll.innerHeight - evt.clientY
		scroll.proximity = Math.min(px1, px2, px3, px4)
		if (scroll.proximity < scroll.radius) {
			if (scroll.dead) {
				return
			}
			if (!scroll.scrolling) {
				scroll.scrolling = true
				window.requestAnimationFrame(scroll.scrollTick)
			}
		} else {
			scroll.scrolling = false
		}
	})

	document.addEventListener('scroll', function () {
		var src
		if (scroll.scrolling) {
			src = scroll
		} else {
			src = window
		}
		var scrollX = src.scrollX
		var scrollY = src.scrollY
		var innerWidth = src.innerWidth
		var innerHeight = src.innerHeight
		scroll.handlers.forEach(function (handler) {
			handler(scrollX, scrollY, innerWidth, innerHeight)
		})
	})

	window.addEventListener('resize', function () {
		scroll.innerWidth = window.innerWidth
		scroll.innerHeight = window.innerHeight
	})


	this.addDeadzone = function (elem) {
		function enterDeadzone () {
			scroll.dead = true
			scroll.scrolling = false
		}

		function leaveDeadzone () {
			scroll.dead = false
		}

		scroll.deadzones.push({
			elem: elem,
			enter: enterDeadzone,
			leave: leaveDeadzone
		})

		elem.addEventListener('mouseenter', enterDeadzone)
		elem.addEventListener('mouseleave', leaveDeadzone)
	}

	this.removeDeadzone = function (elem) {
		this.deadzones.forEach(function (deadzone) {
			if (deadzone.elem === elem) {
				elem.removeEventListener('mouseenter', deadzone.enter)
				elem.removeEventListener('mouseleave', deadzone.leave)
			}
		})
	}
})(100, 750)
