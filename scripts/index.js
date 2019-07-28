var Responsive = /** @class */ (function () {
    function Responsive() {
        this.checkSection = function (section, deltaY) {
            if (section.clientHeight > window.innerHeight) {
                var bodyRect = document.body.getBoundingClientRect();
                var sectionRect = section.getBoundingClientRect();
                var windowY = window.pageYOffset;
                var sectionNotInTheBottom = (Math.floor(sectionRect.bottom - bodyRect.top - window.innerHeight) !== windowY) || deltaY < 0;
                var sectionNotInTheTop = (Math.floor(sectionRect.top - bodyRect.top) !== windowY) || deltaY > 0;
                if (sectionNotInTheBottom && sectionNotInTheTop) {
                    var targetPos = deltaY < 0 ? sectionRect.top : sectionRect.bottom - window.innerHeight;
                    if (sectionRect.top - window.innerHeight < sectionRect.bottom && deltaY > 0) {
                        console.log(sectionRect.bottom);
                        return false;
                        var offset = windowY + window.innerHeight;
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                        return false;
                    }
                    else if (sectionRect.bottom + window.innerHeight > sectionRect.top && deltaY < 0) {
                        var offset = windowY - window.innerHeight;
                        if (sectionRect.top + window.innerHeight > 0 && sectionRect.top + window.innerHeight < window.innerHeight) {
                            var offset_1 = targetPos - bodyRect.top;
                            window.scrollTo({ top: offset_1, behavior: 'smooth' });
                            return false;
                        }
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                        return false;
                    }
                    else {
                        var offset = targetPos - bodyRect.top;
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                        return false;
                    }
                }
                return true;
            }
            return true;
        };
    }
    return Responsive;
}());
var SliderFunctions = /** @class */ (function () {
    function SliderFunctions() {
        this.getSlidesFromSection = function (section) {
            var slides = section.querySelectorAll('.slick-slide');
            var arr = [];
            for (var i = 0; i < slides.length; i++) {
                if (!slides[i].classList.contains('slick-cloned'))
                    arr.push(slides[i]);
            }
            return arr;
        };
        this.wheelSlider = function (i, sections, sliders, deltaY, scroll) {
            var current_slider;
            for (var j = 0; j < sliders.length; j++) {
                if (sliders[j].section_index === i) {
                    current_slider = sliders[j];
                }
            }
            var active_slide = parseInt(sections[i].querySelector('.slick-current').dataset.slickIndex);
            var currentSectionSlider;
            currentSectionSlider = $(sections[i].querySelector('.scroll-slider'));
            if (deltaY > 0) {
                if (active_slide < current_slider.count) {
                    currentSectionSlider.slick('slickNext');
                }
                else {
                    scroll(sections[i + 1], sections[i], deltaY);
                }
            }
            else {
                if (active_slide > 0) {
                    currentSectionSlider.slick('slickPrev');
                }
                else {
                    scroll(sections[i - 1], sections[i], deltaY);
                }
            }
        };
    }
    return SliderFunctions;
}());
var Fullpage = /** @class */ (function () {
    /**
     * Main constructor:
     */
    function Fullpage(selector) {
        var _this = this;
        this.selector = selector;
        /**
         *Sliders settings:
         */
        this.sliders = [];
        /**
         * Friend classes:
         */
        this.SliderFunctions = new SliderFunctions();
        this.Responsive = new Responsive();
        /**
         * Function scroll. Takes section to which need make scroll:
         */
        this.scroll = function (element, fromSection, deltaY) {
            var targetPos = deltaY > 0 ? element.getBoundingClientRect().top : element.getBoundingClientRect().bottom - window.innerHeight;
            var startPos = document.body.getBoundingClientRect().top;
            var offset = targetPos - startPos;
            if (_this.Responsive.checkSection(fromSection, deltaY))
                window.scrollTo({ top: offset, behavior: 'smooth' });
        };
        this.smallScroll = function () {
            window.scrollTo({ top: 50, behavior: 'smooth' });
        };
        /**
         * Function set event wheel for each section. And check does it contain slider:
         */
        this.setEventListeners = function () {
            _this.sliders = [];
            var _loop_1 = function (i) {
                var hasSlider = _this.sections[i].querySelector(".scroll-slider");
                _this.sections[i].addEventListener('mousewheel', function (e) { return _this.wheelEvent(e, i, hasSlider); });
                hasSlider ? _this.setSlidersSettings(i) : 0;
            };
            for (var i = 0; i < _this.count_sections + 1; i++) {
                _loop_1(i);
            }
        };
        /**
         * Function set slider settings which will be needed when scrolling the slider:
         */
        this.setSlidersSettings = function (i) {
            var slides = _this.SliderFunctions.getSlidesFromSection(_this.sections[i]);
            _this.sliders.push({ section_index: i, slides: slides, count: slides.length - 1 });
        };
        this.wheelEvent = function (e, i, hasSlider) {
            e.preventDefault();
            if (!_this.checkCountEvents())
                return;
            if (hasSlider)
                return _this.wheelSlider(e.deltaY, i);
            if (e.deltaY > 0) {
                if (i + 1 <= _this.count_sections) {
                    _this.scroll(_this.sections[i + 1], _this.sections[i], e.deltaY);
                }
                else if (_this.sections[i].clientHeight > window.innerHeight) {
                    _this.scroll(_this.sections[i], _this.sections[i], e.deltaY);
                }
            }
            else {
                if (i - 1 >= 0)
                    _this.scroll(_this.sections[i - 1], _this.sections[i], e.deltaY);
            }
            _this.lastAnimation = new Date().getTime();
        };
        this.wheelSlider = function (deltaY, i) {
            if (!_this.checkCountEvents())
                return;
            _this.SliderFunctions.wheelSlider(i, _this.sections, _this.sliders, deltaY, _this.scroll);
            _this.lastAnimation = new Date().getTime();
        };
        this.checkCountEvents = function () {
            var timeNow = new Date().getTime();
            if (timeNow - _this.lastAnimation < _this.idlePeriod + _this.duration) {
                return false;
            }
            return true;
        };
        this.root = document.querySelector(this.selector);
        this.sections = this.root.querySelectorAll('.section-scroll');
        this.count_sections = this.sections.length - 1;
        this.duration = 600;
        this.lastAnimation = 0;
        this.idlePeriod = 100;
        window.addEventListener('load', this.setEventListeners);
    }
    return Fullpage;
}());
new Fullpage('.root');
