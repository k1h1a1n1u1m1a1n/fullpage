var Options = /** @class */ (function () {
    function Options() {
        var _this = this;
        this.initOptionsSlider = function (slider) {
            var arr = [];
            for (var i = 0; i < slider.length; i++) {
                arr.push(document.querySelector(slider[i]));
            }
            return arr;
        };
        this.initOptions = function (options) {
            console.log(options);
            var globalOptions = null;
            if (options) {
                globalOptions = {};
                if (options.slider) {
                    globalOptions = _this.initOptionsSlider(options.slider);
                }
            }
            return globalOptions;
        };
    }
    return Options;
}());
var Sliders = /** @class */ (function () {
    function Sliders() {
        this.getSlidesInSection = function (sections, i) {
            var slides = sections[i].querySelectorAll('.slick-slide');
            var arr = [];
            for (var i_1 = 0; i_1 < slides.length; i_1++) {
                if (!slides[i_1].classList.contains('slick-cloned'))
                    arr.push(slides[i_1]);
            }
            return arr;
        };
    }
    return Sliders;
}());
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}
var Fullpage = /** @class */ (function () {
    /**
     * Main constructor:
     */
    function Fullpage(selector, options) {
        var _this = this;
        if (options === void 0) { options = null; }
        this.selector = selector;
        /**
         * Function scroll. Takes section to which need make scroll:
         */
        this.scroll = function (element) {
            var targetPos = element.getBoundingClientRect().top;
            var startPos = document.body.getBoundingClientRect().top;
            var offset = targetPos - startPos;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        };
        /**
         * Function set event wheel for each section. And check does it contain slider:
         */
        this.setEventListeners = function () {
            var _loop_1 = function (i) {
                var hasSlider = _this.sections[i].classList.contains("has-slider");
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
            _this.sliders = [];
            var slides = _this.getSlides(i);
            _this.sliders.push({ section_index: i, slides: slides, count: slides.length - 1 });
        };
        this.getSlides = function (i) {
            var slides = _this.sections[i].querySelectorAll('.slick-slide');
            var arr = [];
            for (var i_2 = 0; i_2 < slides.length; i_2++) {
                if (!slides[i_2].classList.contains('slick-cloned'))
                    arr.push(slides[i_2]);
            }
            return arr;
        };
        this.wheelEvent = function (e, i, hasSlider) {
            e.preventDefault();
            if (!_this.checkCountEvents())
                return;
            if (hasSlider)
                return _this.sliderSlide(e.deltaY, i);
            if (e.deltaY > 0) {
                if (i + 1 <= _this.count_sections)
                    _this.scroll(_this.sections[i + 1]);
            }
            else {
                if (i - 1 >= 0)
                    _this.scroll(_this.sections[i - 1]);
            }
            _this.lastAnimation = new Date().getTime();
        };
        this.sliderSlide = function (deltaY, i) {
            if (!_this.checkCountEvents())
                return;
            var current_slider;
            for (var j = 0; j < _this.sliders.length; j++) {
                if (_this.sliders[j].section_index === i) {
                    current_slider = _this.sliders[j];
                }
            }
            var active_slide = parseInt($('.slick-current').attr("data-slick-index"));
            var y;
            y = $('.slick-slider');
            if (deltaY > 0) {
                if (active_slide < current_slider.count) {
                    y.slick('slickNext');
                }
                else {
                    _this.scroll(_this.sections[i + 1]);
                }
            }
            else {
                if (active_slide > 0) {
                    y.slick('slickPrev');
                }
                else {
                    _this.scroll(_this.sections[i - 1]);
                }
            }
            _this.lastAnimation = new Date().getTime();
        };
        this.checkCountEvents = function () {
            var timeNow = new Date().getTime();
            if (timeNow - _this.lastAnimation < _this.idlePeriod + _this.duration) {
                return false;
            }
            return true;
        };
        /**
         * Init Options class
         */
        applyMixins(Fullpage, [Options, Sliders]);
        this.root = document.querySelector(this.selector);
        this.sections = this.root.querySelectorAll('.section-scroll');
        this.count_sections = this.sections.length - 1;
        this.duration = 600;
        this.lastAnimation = 0;
        this.idlePeriod = 100;
        //Init sliders options
        // console.log(Fullpage.prototype.initOptions(options));
        window.addEventListener('load', this.setEventListeners);
    }
    return Fullpage;
}());
new Fullpage('.root', {
    slider: ['.slick-slider']
});
