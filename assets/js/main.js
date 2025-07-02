/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);

			// Gallery Carousel
			(function() {
				var $gallery = $('.gallery-container');
				var $images = $gallery.find('img');
				var imageCount = $images.length;
				var currentIndex = 0;

				if (imageCount > 0) {
					setInterval(function() {
						// Remove active class from current image
						$images.eq(currentIndex).removeClass('active');

						// Update index to the next image
						currentIndex = (currentIndex + 1) % imageCount;

						// Add active class to the new image
						$images.eq(currentIndex).addClass('active');
					}, 4000); // Change image every 4 seconds
				}
			})();

		});

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

	// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide <img>.
					$img.hide();

			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

	// Mobile Navigation
	(function() {
		const hamburgerButton = document.getElementById('hamburger-button');
		const mobileNavPanel = document.getElementById('mobile-nav-panel');
		const pageOverlay = document.getElementById('page-overlay');
		const body = document.body;
		let isNavVisible = false;

		function buildMobileNav() {
			// Clear any existing content
			mobileNavPanel.innerHTML = '';

			// Add Profile Picture
			const profilePic = document.createElement('img');
			profilePic.src = 'images/Personal-Photo-5.webp';
			profilePic.alt = 'Marco Quantrill';
			profilePic.className = 'profile-pic-mobile';
			mobileNavPanel.appendChild(profilePic);

			// Add Social Links
			const socialLinks = document.createElement('div');
			socialLinks.className = 'social-links-mobile';
			socialLinks.innerHTML = `
				<a href="https://github.com/MQuantrillC" target="_blank" class="icon brands fa-github"><span class="label">GitHub</span></a>
				<a href="https://wa.me/51980582864" target="_blank" class="icon brands fa-whatsapp"><span class="label">WhatsApp</span></a>
				<a href="https://www.linkedin.com/in/marco-quantrill-crevoisier-a65213233/" target="_blank" class="icon brands fa-linkedin-in"><span class="label">LinkedIn</span></a>
			`;
			mobileNavPanel.appendChild(socialLinks);
			
			// Clone navigation links from sidebar
			const sidebarNav = document.querySelector('#sidebar nav ul');
			if (sidebarNav) {
				const clonedNav = sidebarNav.cloneNode(true);
				mobileNavPanel.appendChild(clonedNav);
			}

			// Add click listeners to close panel
			const links = mobileNavPanel.querySelectorAll('a');
			links.forEach(link => {
				link.addEventListener('click', function(e) {
					if (this.getAttribute('href').startsWith('#')) {
						e.preventDefault();
						const targetId = this.getAttribute('href');
						const targetElement = document.querySelector(targetId);
						if (targetElement) {
							targetElement.scrollIntoView({ behavior: 'smooth' });
						}
						toggleNav();
					}
				});
			});
		}

		function toggleNav() {
			isNavVisible = !isNavVisible;
			hamburgerButton.classList.toggle('active', isNavVisible);
			mobileNavPanel.classList.toggle('active', isNavVisible);
			pageOverlay.classList.toggle('active', isNavVisible);
			body.classList.toggle('noscroll', isNavVisible);
		}

		hamburgerButton.addEventListener('click', function(e) {
			e.stopPropagation();
			if (!isNavVisible) {
				buildMobileNav();
			}
			toggleNav();
		});

		pageOverlay.addEventListener('click', function() {
			if (isNavVisible) {
				toggleNav();
			}
		});

	})();

})(jQuery);