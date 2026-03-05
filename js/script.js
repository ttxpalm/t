document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // Mobile Navigation Toggle
    // ==========================================
    const toggle = document.getElementById("mobile-toggle");
    const nav = document.getElementById("nav-menu");

    if (toggle && nav) {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            nav.classList.toggle("show");
            const isExpanded = nav.classList.contains("show");
            toggle.setAttribute("aria-expanded", isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (nav.classList.contains("show") && !nav.contains(e.target) && !toggle.contains(e.target)) {
                nav.classList.remove("show");
                toggle.setAttribute("aria-expanded", "false");
            }
        });

        // Close menu when a link is clicked
        const navLinksMenu = nav.querySelectorAll(".nav-link");
        navLinksMenu.forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("show");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ==========================================
    // Active Nav Link (Scroll Spy)
    // ==========================================
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    /**
     * Updates the active state of navigation links based on the current section.
     * @param {string} id - The ID of the section currently in view.
     */
    function setActiveLink(id) {
        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + id) {
                link.classList.add("active");
            }
        });
    }

    if (sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -50% 0px",
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach((section) => observer.observe(section));
    }

    // ==========================================
    // Header Scroll Effect (Optimized)
    // ==========================================
    const header = document.querySelector(".header");
    const heroSection = document.querySelector("#home");

    if (header && heroSection) {
        let ticking = false;

        function updateHeader() {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            const headerHeight = header.offsetHeight;

            if (heroBottom <= headerHeight) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true });

        // Initial check
        updateHeader();
    }
});

// ==========================================
// Accordion Toggle
// ==========================================
window.toggleAccordion = function (element) {
    const accordion = element.parentElement;
    accordion.classList.toggle('active');
};

// ==========================================
// FAQ Toggle (Section 7)
// ==========================================
window.toggleFaq = function (btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const qBtn = i.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
    });

    // If it wasn't open, open it
    if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
    }
};

// ==========================================
// Mini Calendar (Section 7)
// ==========================================
(function () {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const today = new Date();
    let viewYear = today.getFullYear();
    let viewMonth = today.getMonth(); // 0-indexed

    function renderCalendar() {
        const grid = document.getElementById('cal-grid');
        const label = document.getElementById('cal-month-label');
        if (!grid || !label) return;

        label.textContent = monthNames[viewMonth] + ' ' + viewYear;
        grid.innerHTML = '';

        const firstDay = new Date(viewYear, viewMonth, 1);
        // Monday-first: 0=Mon…6=Sun; JS: 0=Sun…6=Sat
        let startOffset = firstDay.getDay() - 1;
        if (startOffset < 0) startOffset = 6;

        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

        // Empty cells
        for (let i = 0; i < startOffset; i++) {
            const empty = document.createElement('div');
            empty.className = 'cal-day empty';
            grid.appendChild(empty);
        }

        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('button');
            cell.className = 'cal-day';
            cell.textContent = d;

            const thisDate = new Date(viewYear, viewMonth, d);
            const isToday = (d === todayDate && viewMonth === todayMonth && viewYear === todayYear);
            const isPast = thisDate < new Date(todayYear, todayMonth, todayDate);

            if (isToday) {
                cell.classList.add('today', 'available', 'has-dot');
            } else if (isPast) {
                cell.classList.add('past');
                cell.disabled = true;
            } else {
                // Mark some days as available (weekdays)
                const dayOfWeek = thisDate.getDay(); // 0=Sun
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    cell.classList.add('available');
                    // Add dot for a few days to mimic the design
                    if (d % 5 === 0 || d % 7 === 0) {
                        cell.classList.add('has-dot');
                    }
                } else {
                    cell.classList.add('past');
                    cell.disabled = true;
                }
            }

            cell.addEventListener('click', function () {
                document.querySelectorAll('.cal-day.selected').forEach(el => el.classList.remove('selected'));
                if (!this.classList.contains('past')) {
                    this.classList.add('selected');
                }
            });

            grid.appendChild(cell);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        renderCalendar();

        const prev = document.getElementById('cal-prev');
        const next = document.getElementById('cal-next');

        if (prev) {
            prev.addEventListener('click', function () {
                viewMonth--;
                if (viewMonth < 0) { viewMonth = 11; viewYear--; }
                renderCalendar();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                viewMonth++;
                if (viewMonth > 11) { viewMonth = 0; viewYear++; }
                renderCalendar();
            });
        }

        // Timezone Interactivity
        const tzTrigger = document.getElementById('tz-trigger');
        const tzDropdown = document.getElementById('tz-dropdown');
        const tzOptions = document.querySelectorAll('.tz-option');
        const currentTzSpan = document.getElementById('current-tz');

        if (tzTrigger && tzDropdown) {
            tzTrigger.addEventListener('click', function (e) {
                e.stopPropagation();
                tzDropdown.classList.toggle('show');
            });

            document.addEventListener('click', function (e) {
                if (!tzDropdown.contains(e.target) && !tzTrigger.contains(e.target)) {
                    tzDropdown.classList.remove('show');
                }
            });

            tzOptions.forEach(option => {
                option.addEventListener('click', function () {
                    const newTz = this.getAttribute('data-tz');
                    currentTzSpan.textContent = newTz + ' ▾';

                    tzOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');

                    tzDropdown.classList.remove('show');
                });
            });
        }
    });
})();

